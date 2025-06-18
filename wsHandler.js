const WebSocket = require('ws');

const rooms = new Map();

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            const data = JSON.parse(message);

            if (data.type === 'create-room') {
                const roomId = Math.floor(100000 + Math.random() * 900000).toString();
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

            if (data.type === 'chat-message') {
                const room = rooms.get(data.roomId);
                if (room) {
                    const target = ws === room.host ? room.guest : room.host;
                    if (target) {
                        target.send(JSON.stringify({
                            type: 'chat-message',
                            message: data.message,
                            sender: ws === room.host ? 'Host' : 'Guest',
                            timestamp: new Date().toISOString()
                        }));
                    }
                }
            }

            if (data.type === 'file-meta' || data.type === 'file-chunk' || data.type === 'chunk-ack') {
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
