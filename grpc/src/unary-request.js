import { Client, StatusOK } from 'k6/net/grpc';
import { check, sleep } from 'k6';


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
    client.connect(SERVER_ADDRESS, {
        plaintext: true,
    });

    const response = client.invoke('greet.v1.GreetService/UnaryGreet', {
        name: "k6"
    },);

    check(response, {
        'status is 200': (r) => r && r.status === StatusOK,
    });

    console.log(JSON.stringify(response.message));

    client.close();
    sleep(1);
}
