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
                response
            };
        }
        catch (error) {
            return {
                ok: false,
                error
            };
        }
    }

    public async getMe() {
        const result = await this.call('getMe');
        if (result.ok) {
            return result.response?.data.result
        } else if (!result.ok) {
            console.log(result.error);
            throw new Error("Ishlamadi");
        }
    }
}

export default Fint;