// Declaration for process.env, to get webpack.EnvironmentPlugin
// to work with typescript

declare var process: {
    env: {
        READABLE_APP_API_URL: string;
    };
};
