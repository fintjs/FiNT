import Fint from "./Fint"

export {
    Fint
};

// Test

const token = "TOKEN";

const bot = new Fint(token);

bot.start();

(async () => {
    const me = await bot.getMe();
    console.log(me);
})();
