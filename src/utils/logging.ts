function log(message: string, ...rest: string[]) {
    if (message.startsWith("<--")) {
        console.log(message.substring(4), ...rest);
    }
}

export default log;
