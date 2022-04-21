import axios, { Axios } from 'axios';

class Fint {
    private token;
    private api: Axios;

    constructor(
        token: String,
        options?: {}
    ) {
        this.token = token;
        this.api = axios.create({
            baseURL: "https://api.telegram.org/bot" + token
        })
    }

    private async call(method: String) {
        try {
            const response = await this.api.get('/' + method);
            return {
                ok: true,
                data: response.data.result
            };
        }
        catch (error) {
            return {
                ok: false,
                error
            };
        }
    }

    private async getUpdates() {
        const { ok, data: updates, error } = await this.call('getUpdates');
        if (!ok) {
            console.log(error);
            throw new Error("Can't perform handleUpdates method");
        }
        return updates;
    }

    public async getMe() {
        const result = await this.call('getMe');
        if (!result.ok) {
            console.log(result.error);
            throw new Error("Can't perform getMe method");
        }
        return result.data;
    }
 
    public async start() {
        const updates = await this.getUpdates();
        console.log(updates);
    }
}

export default Fint;