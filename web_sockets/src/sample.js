import ws from 'k6/ws';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        testRequests: {
            executor: "ramping-arrival-rate",
            startRate: 1,
            timeUnit: "1s",
            preAllocatedVUs: 5,
            maxVUs: 10,
            stages: [
                { target: 5, duration: "1m" },
                { target: 5, duration: "2m" },
                { target: 0, duration: "1m" }
            ],
        },
    },
};

export default function () {
    const url = 'ws://localhost:8080/ws';
    const params = { tags: { sample_tag: 'greeting' } };

    const res = ws.connect(url, params, function (socket) {
        socket.on('open', () => {
            console.log('connected')

            // Send a message to the server
            socket.send(
                JSON.stringify({
                    type: 'greeting',
                    message: 'hello',
                }),
            )

            // To schedule a recurring action
            // socket.setInterval(function timeout() {
            //     socket.ping();
            //     console.log('Pinging every 1sec (setInterval test)');
            // }, 1000);
        },);
        socket.on('message', (data) => console.log('Message received: ', data));

        // Multiple event handlers
        // socket.on('ping', () => console.log('PING!'));
        // socket.on('pong', () => console.log('PONG!'));
        // socket.on('pong', () => {
        //     // Multiple event handlers on the same event
        //     console.log('OTHER PONG!');
        // });

        socket.on('close', () => console.log('disconnected'));
        socket.on('error', (err) => {
            if (err.error() != 'websocket: close sent') {
                console.error('An unexpected error occured: ', err.error());
            }
        })

        // Timeout for the connection
        socket.setTimeout(function () {
            console.log('2 seconds passed, closing the socket');
            socket.close();
        }, 2000);
    });

    check(res, { 'status is 101': (r) => r && r.status === 101 });
}