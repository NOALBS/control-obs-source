// Rate limit on joins: 50 JOINs per 15 seconds
// Is there actually still a rate limit?????

/**
 * Queue to join channels.
 */
class JoinQueue {
    /**
     *
     * @param {WebSocket} ws - The websocket.
     * @param {string[]} channels - The channel(s) to join.
     */
    constructor(ws, channels) {
        this.channels = channels;
        this.ws = ws;

        this.joins = 50;
        this.seconds = 15;
        this.position = 0;
        this.positionEnd = this.joins;

        this.join = this.join.bind(this);

        this.init();
    }

    /**
     * The join queue loop.
     * Grabs this.joins channels and repeat every this.seconds seconds.
     */
    init() {
        this.join();
        this.interval = setInterval(this.join, 1000 * this.seconds);
    }

    /**
     * The function to join channels.
     */
    join() {
        const c = this.channels.slice(this.position, this.positionEnd);

        if (c.length) {
            c.forEach(e => {
                this.ws.send(`JOIN #${e.toLowerCase()}`);
            });

            this.position += this.joins;
            this.positionEnd += this.joins;
        } else {
            clearInterval(this.interval);
        }
    }
}

export default JoinQueue;
