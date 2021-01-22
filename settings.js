export class Settings {
    static functions = new Map();

    /**
     * listen to specific document update change
     * @param {*} binder - { coll: string, name (uniqueFieldOfDocument): string  }
     * @param {*} callback - function that receives the following params: (fullDocument, updatedFields)
     */
    static on(binder, callback) {
        Settings.functions.set(`${JSON.stringify(binder)}`, callback);
    }

    static execute({ operationType, fullDocument, updateDescription, ns }) {
        const key = JSON.stringify({ coll: ns.coll, name: fullDocument.name });
        console.log('executed, settingsFunctionLength:', Settings.functions.entries())
        // can add special actions according to operationType
        if (operationType === 'update') {
            const callback = Settings.functions.get(key);
            if (callback) callback(fullDocument, updateDescription.updatedFields);
        } else if (operationType === 'insert') {
            return;
        }
    }
}