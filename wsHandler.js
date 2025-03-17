const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const rooms = new Map();

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            const data = JSON.parse(message);

            if (data.type === 'create-room') {
                const roomId = uuidv4().slice(0, 6);
                rooms.set(roomId, { host: ws, guest: null });
                ws.send(JSON.stringify({ type: 'room-created', roomId }));
            }

            if (data.type === 'join-room') {
                const room = rooms.get(data.roomId);
                if (room && !room.guest) {
                    room.guest = ws;
                    room.host.send(JSON.stringify({ type: 'peer-joined' }));
                    room.guest.send(JSON.stringify({ type: 'peer-joined' }));
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Room not found or full' }));
                }
            }

            if (data.type === 'file-meta' || data.type === 'file-chunk') {
                const room = rooms.get(data.roomId);
                if (room) {
                    const target = ws === room.host ? room.guest : room.host;
                    if (target) target.send(JSON.stringify(data));
                }
            }
        });

        ws.on('close', () => {
            for (const [roomId, room] of rooms) {
                if (room.host === ws || room.guest === ws) {
                    rooms.delete(roomId);
                }
            }
        });
    });

    console.log('WebSocket server initialized');
}

module.exports = { setupWebSocket };
