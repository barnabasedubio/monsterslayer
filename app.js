const App = Vue.createApp({
    data() {
        return {
            playerCurrentHealth: 100,
            monsterCurrentHealth: 100,
            finalResult: "",
            battleLog: [],
            gameOver: false,
            winner: "",
            medkitAmount: 3,
        };
    },
    computed: {},
    methods: {
        getRandumNumberInRange(max) {
            return Math.floor(Math.random() * Math.floor(max)) + 1; // + 1 includes number of range
        },
        attack(who, value = 0) {
            let attackValue =
                value > 0 ? value : this.getRandumNumberInRange(10);
            if (who === "You") {
                this.monsterCurrentHealth = Math.max(
                    0,
                    this.monsterCurrentHealth - attackValue
                );
                this.updateBattleLog(
                    `You dealt ${attackValue} damage to the Monster`
                );
                if (this.monsterCurrentHealth === 0) {
                    this.updateBattleLog("You defeated the Monster!");
                    this.gameOver = true;
                    this.winner = "You";
                } else {
                    this.attack("Monster");
                }
            } else {
                this.playerCurrentHealth = Math.max(
                    0,
                    this.playerCurrentHealth - attackValue
                );
                this.updateBattleLog(
                    `The Monster dealt ${attackValue} damage to you.`
                );
                if (this.playerCurrentHealth === 0) {
                    this.updateBattleLog("You were killed by the Monster.");
                    this.gameOver = true;
                    this.winner = "Monster";
                }
            }
        },
        specialAttack() {
            // 25% chance of a 3x Hit multiplier
            let activateSpecialAttack =
                this.getRandumNumberInRange(100) % 4 === 0;
            if (activateSpecialAttack) {
                this.updateBattleLog(
                    "You tried the special attack...and SUCCEEDED!"
                );
                let attackValue = this.getRandumNumberInRange(10) * 3;
                this.attack("You", attackValue);
            } else {
                this.updateBattleLog(
                    "You tried the special attack...and failed."
                );
                this.attack("Monster");
            }
        },
        heal() {
            // 33% chance of dropping
            // 33% chance of monster stealing it and using it for itself
            // 33% chance of being effective
            if (this.medkitAmount > 0) {
                let possiblity = this.getRandumNumberInRange(100) % 3;
                let healAmount = this.getRandumNumberInRange(7) + 7;
                switch (possiblity) {
                    case 0:
                        this.updateBattleLog(
                            "You tried healing yourself but dropped the medkit!"
                        );
                        this.attack("Monster");
                        break;
                    case 1:
                        this.updateBattleLog(
                            "The monster snatched the medkit from you and used it on itself!"
                        );
                        this.monsterCurrentHealth = Math.min(
                            100,
                            this.monsterCurrentHealth + healAmount
                        );
                        break;
                    case 2:
                        this.updateBattleLog(
                            `You used a medkit! (+${healAmount} HP)`
                        );
                        this.playerCurrentHealth = Math.min(
                            100,
                            this.playerCurrentHealth + healAmount
                        );
                        this.attack("Monster");
                        break;
                }
                this.medkitAmount -= 1;
            } else {
                this.updateBattleLog(
                    "You tried healing yourself but forgot that you used up all of your medkits!"
                );
                this.attack("Monster");
            }
        },
        surrender() {
            // 33% chance of successful surrender
            let possiblity = this.getRandumNumberInRange(100) % 3;
            switch (possiblity) {
                case 0:
                    this.updateBattleLog(
                        "The Monster accepts your surrender and lets you live."
                    );
                    this.gameOver = true;
                    this.winner = "Monster"
                    break;
                default:
                    this.updateBattleLog(
                        "The Moster does not accept your surrender!"
                    );
                    this.attack("Monster");
            }
        },
        updateBattleLog(text) {
            this.battleLog.push(text);
        },
    },
});

App.mount("#app");
