import { Client, Stream } from 'k6/net/grpc';
import { sleep } from 'k6';

const PROTO_FILE = './greet.proto';
const SERVER_ADDRESS = '127.0.0.1:8080';

const client = new Client();
client.load(['../definitions'], PROTO_FILE);

export const options = {
    insecureSkipTLSVerify: true,
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


export default () => {
    client.connect(SERVER_ADDRESS,
        {
            plaintext: true,
        },
    );

    const stream = new Stream(client, 'greet.v1.GreetService/ServerStreamGreet', null)

    stream.on("data", (data) => {
        console.log(data);
    });

    stream.on('end', () => {
        client.close();
        console.log('All done');
    })


    stream.write({ name: 'k6' });

    sleep(1);
}