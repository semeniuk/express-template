const Store = require("./../store"),
    logger = require("./../../lib/logger");

class PhotosStore extends Store {
    constructor() {
        logger.debug("PhotosStore created");
        super("photos");
    }
    async getNextId() {
        var result = await this.client.db().collection("counters").findOneAndUpdate({ _id: "photos" }, { $inc: { next: 1 } }, { upsert: true });
        return result.value.next;
    }
    async insert(docs, options) {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }
        let nextId = await this.getNextId();
        for (let doc of docs) {
            doc._id = nextId;
            nextId++;
        }
        return super.insert(docs, options);
    }
}

module.exports = new PhotosStore();