import Fint from "./Fint"

export {
    Fint
};

// Test

const token = "TOKEN";

const bot = new Fint(token);

(async () => {
    const me = await bot.getMe();
    console.log(me);
})();
