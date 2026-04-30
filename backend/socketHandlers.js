const { getRandomWords, WORD_LISTS } = require('./wordLists_backend');

const races = new Map();
let finishOrder = new Map(); // roomId -> [socketId, ...]
const startTimers = new Map(); // roomId -> Timeout

module.exports = (io) => {
  io.on('connection', (socket) => {

    socket.on('join_race', ({ roomId, username, isPrivate = false, language = 'english' }) => {
      socket.join(roomId);

      if (!races.has(roomId)) {
        races.set(roomId, {
          players: {},
          status: 'waiting', // waiting | starting | running | finished
          text: '',
          startTime: null,
          isPrivate,
          language,
        });
        finishOrder.set(roomId, []);
      }

      const race = races.get(roomId);

      if (race.status === 'running' || race.status === 'finished') {
        socket.emit('race_busy', { message: 'A race is in progress. Please wait.' });
        return;
      }

      race.players[socket.id] = {
        username,
        progress: 0,   // 0-100 percent
        wpm: 0,
        position: null, // finishing position (1st, 2nd, etc.)
        isBot: false,
      };

      const playerCount = Object.keys(race.players).length;

      io.to(roomId).emit('lobby_update', {
        players: race.players,
        status: race.status,
        needed: Math.max(0, 5 - playerCount),
      });

      // BOT SYSTEM: If only one player is in for 10 seconds, add bots
      if (playerCount === 1 && !startTimers.has(roomId)) {
        const botTimer = setTimeout(() => {
          addBots(io, roomId);
        }, 10000);
        startTimers.set(roomId + '_bot', botTimer);
      }

      // Start countdown if we have 2+ players
      if (playerCount >= 2 && race.status === 'waiting' && !startTimers.has(roomId)) {
        const timer = setTimeout(() => {
          beginCountdown(io, roomId);
          startTimers.delete(roomId);
        }, 15000); // 15 second wait
        startTimers.set(roomId, timer);
      }

      // Instant start if full
      if (playerCount >= 5 && race.status === 'waiting') {
        if (startTimers.has(roomId)) {
          clearTimeout(startTimers.get(roomId));
          startTimers.delete(roomId);
        }
        beginCountdown(io, roomId);
      }
    });

    socket.on('update_progress', ({ roomId, progress, wpm }) => {
      const race = races.get(roomId);
      if (!race || race.status !== 'running') return;
      if (!race.players[socket.id]) return;

      // ANTI-CHEAT: Calculate expected max progress/wpm based on elapsed time
      const elapsedMinutes = (Date.now() - race.startTime) / 60000;
      // 350 WPM is the absolute human maximum
      const maxPossibleChars = 350 * 5 * elapsedMinutes;
      const actualCharsTyped = (progress / 100) * race.text.length;

      // If they somehow typed more characters than humanly possible (with a small buffer), cap them
      if (actualCharsTyped > maxPossibleChars + 20) {
        return;
      }

      race.players[socket.id].progress = progress;
      race.players[socket.id].wpm = Math.min(wpm, 350); // Cap WPM display

      // Check if player just finished
      if (progress >= 100 && !race.players[socket.id].position) {
        const order = finishOrder.get(roomId);
        order.push(socket.id);
        race.players[socket.id].position = order.length; // 1st, 2nd, etc.

        // Check if everyone finished
        const allDone = Object.values(race.players).every(p => p.position);
        if (allDone) {
          race.status = 'finished';
          io.to(roomId).emit('race_finished', { players: race.players });

          // Reset room after 15 seconds
          setTimeout(() => {
            races.delete(roomId);
            finishOrder.delete(roomId);
          }, 15000);
        }
      }

      io.to(roomId).emit('race_update', { players: race.players });
    });

    const handlePlayerLeave = (socketId) => {
      for (const [roomId, race] of races.entries()) {
        if (race.players[socketId]) {
          delete race.players[socketId];
          const remainingHumans = Object.values(race.players).filter(p => !p.isBot).length;
          
          if (remainingHumans === 0) {
            if (startTimers.has(roomId)) {
              clearTimeout(startTimers.get(roomId));
              startTimers.delete(roomId);
            }
            if (startTimers.has(roomId + '_bot')) {
              clearTimeout(startTimers.get(roomId + '_bot'));
              startTimers.delete(roomId + '_bot');
            }
            races.delete(roomId);
            finishOrder.delete(roomId);
          } else {
            if (race.status === 'running') {
              const allDone = Object.values(race.players).every(p => p.position);
              if (allDone) {
                race.status = 'finished';
                io.to(roomId).emit('race_finished', { players: race.players });
                setTimeout(() => {
                  races.delete(roomId);
                  finishOrder.delete(roomId);
                }, 15000);
              }
            } else {
              io.to(roomId).emit('lobby_update', {
                players: race.players,
                status: race.status,
                needed: Math.max(0, 5 - Object.keys(race.players).length),
              });
            }
          }
          const socketInstance = io.sockets.sockets.get(socketId);
          if (socketInstance) socketInstance.leave(roomId);
        }
      }
    };

    socket.on('leave_race', () => {
      handlePlayerLeave(socket.id);
    });

    socket.on('disconnect', () => {
      handlePlayerLeave(socket.id);
    });
  });
};

function addBots(io, roomId) {
  const race = races.get(roomId);
  if (!race || race.status !== 'waiting') return;

  const botCount = 2 + Math.floor(Math.random() * 2); // Add 2-3 bots
  const botNames = ['TurboTurtle', 'SpeedyGonzales', 'KeyboardCat', 'PreetiPrince', 'TypeWriter_99'];

  for (let i = 0; i < botCount; i++) {
    const botId = 'bot_' + Math.random().toString(36).substr(2, 9);
    race.players[botId] = {
      username: botNames[Math.floor(Math.random() * botNames.length)] + ' (Bot)',
      progress: 0,
      wpm: 40 + Math.floor(Math.random() * 40), // 40-80 WPM
      position: null,
      isBot: true,
    };
  }

  io.to(roomId).emit('lobby_update', {
    players: race.players,
    status: race.status,
    needed: 0,
  });

  beginCountdown(io, roomId);
}

function beginCountdown(io, roomId) {
  const race = races.get(roomId);
  if (!race || race.status !== 'waiting') return;

  race.status = 'starting';
  race.text = getRandomWords(race.language || 'english', 15).join(' ');
  let count = 5;

  io.to(roomId).emit('race_starting', { text: race.text, countdown: count });

  const timer = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(timer);
      race.status = 'running';
      race.startTime = Date.now();
      io.to(roomId).emit('race_go', { text: race.text });

      // Start bot movement
      Object.entries(race.players).forEach(([id, p]) => {
        if (p.isBot) simulateBot(io, roomId, id);
      });
    } else {
      io.to(roomId).emit('race_countdown', { countdown: count });
    }
  }, 1000);
}

function simulateBot(io, roomId, botId) {
  const race = races.get(roomId);
  if (!race || race.status !== 'running') return;

  const bot = race.players[botId];
  const charSpeed = (bot.wpm * 5) / 60; // chars per second
  const totalChars = race.text.length;

  const interval = setInterval(() => {
    const currentRace = races.get(roomId);
    if (!currentRace || currentRace.status !== 'running' || !currentRace.players[botId]) {
      clearInterval(interval);
      return;
    }

    bot.progress += (charSpeed / totalChars) * 100;
    
    if (bot.progress >= 100) {
      bot.progress = 100;
      clearInterval(interval);
      
      const order = finishOrder.get(roomId);
      order.push(botId);
      bot.position = order.length;

      const allDone = Object.values(currentRace.players).every(p => p.position);
      if (allDone) {
        currentRace.status = 'finished';
        io.to(roomId).emit('race_finished', { players: currentRace.players });
        setTimeout(() => { races.delete(roomId); finishOrder.delete(roomId); }, 15000);
      }
    }

    io.to(roomId).emit('race_update', { players: currentRace.players });
  }, 1000);
}
