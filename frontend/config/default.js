const NODE_ENV = process.env.NODE_ENV

const config = {
    production: {
        domain: {
            client: "https://recoore.com",
            server: "https://recoore.com/api",
        }
    },
    development: {
        domain: {
            client: "http://localhost:3000",
            // server: "https://recoore.com/api",
            server: "http://localhost:3001",
            ws: 'localhost:3001',
            wsPath: '/socket.io'
        }
    }
}
export default config[NODE_ENV]


