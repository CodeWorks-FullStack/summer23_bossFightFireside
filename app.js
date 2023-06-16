const knightElem = document.getElementById('knight')
const bossLevelElem = document.getElementById("level")
const bossHPElem = document.getElementById("boss-health")
const heroHPElem = document.getElementById("hero-health")
const gold = document.getElementById("gold")
const monsterGif = document.getElementById("monster-gif")
// @ts-ignore
const toast = new bootstrap.Toast(document.getElementById('danger-toast'))
const wolfTurns = document.getElementById('wolfTurns')
const unicornTurns = document.getElementById('unicornTurns')
const wizardTurns = document.getElementById('wizardTurns')

// ANCHOR one update function that handles any and all updating the DOM
function update() {
    // @ts-ignore
    bossHPElem.innerText = boss.hp
    // @ts-ignore
    heroHPElem.innerText = hero.hp
    // @ts-ignore
    bossLevelElem.innerText = boss.lvl
    // @ts-ignore
    gold.innerHTML = hero.gold
    // @ts-ignore
    wolfTurns.innerText = companions[0].turnsAvailable
    // @ts-ignore
    wizardTurns.innerText = companions[1].turnsAvailable
    // @ts-ignore
    unicornTurns.innerText = companions[2].turnsAvailable
}


// #region Starter Code (main game)

let fighting = false
function debounce(func, timeout = 950) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

function reset() {
    fighting = false
    // @ts-ignore
    knightElem.src = "assets/knight.webp"
}

const delayReset = debounce(reset)
function animateAttack() {
    if (!fighting) {
        fighting = true
        // @ts-ignore
        knightElem.src = "assets/attack.webp"
    }
    delayReset()
}

const hero = {
    hp: 100,
    gold: 0
}

const boss = {
    hp: 100,
    lvl: 1
}




function attack() {
    if (hero.hp <= 0) {
        return
    }
    boss.hp -= 5
    if (boss.hp < 0) {
        bossLevelUp()
    }
    animateAttack()
    update()
}

function bossLevelUp() {
    boss.lvl++
    boss.hp = boss.lvl * 100
    hero.gold += boss.lvl * 100
    // @ts-ignore
    monsterGif.style.transform = `scale(${(10 + boss.lvl) * .1})`
    toast.show()
}

function bossAttack() {
    hero.hp -= boss.lvl
    if (hero.hp <= 0) {
        hero.hp = 0
        heroDeath()
    }
    update()
}

function heroDeath() {
    // @ts-ignore
    knightElem.src = "assets/death.webp"
    document.body.style.backgroundImage = "url(assets/died.jpg)"
    document.body.classList.add('dead')
}


setInterval(bossAttack, 2000)

// #endregion

// #region Companion Code

const companions = [
    {
        name: 'wolf',
        type: 'dmg',
        cost: 100,
        purchasableTurns: 15,
        turnsAvailable: 0, // this operates like the 'qauntity' that I have of this specific companion
        value: 1
    },
    {
        name: 'wizard',
        type: 'dmg',
        cost: 300,
        purchasableTurns: 10,
        turnsAvailable: 0,
        value: 5
    },
    {
        name: 'unicorn',
        type: 'heal',
        cost: 500,
        purchasableTurns: 15,
        turnsAvailable: 0,
        value: 1
    }
]

// ANCHOR these are our refactored functions for buying AND applying the companions

function buyCompanion(companionName) {
    const companion = companions.find(c => c.name == companionName)
    if (hero.gold >= companion.cost) {
        companion.turnsAvailable = companion.purchasableTurns
        hero.gold -= companion.cost
        console.log('buying', companion);
        update()
    } else {
        window.alert("You don't have enough")
    }
}

function applyCompanion() {
    companions.forEach(c => {
        if (c.turnsAvailable > 0) {
            c.turnsAvailable--
            if (c.type == 'dmg') { // check the type of companion to determine if we attack the boss or heal the hero
                boss.hp -= c.value
            } else { // no need for else-if here because companions are either type:'dmg' OR type:'heal'
                hero.hp += c.value
            }
        }
        update()
    })
}

setInterval(applyCompanion, 1000) // NOTE: this replaced our interval for the wolfAttack AND unicornHeal intervals



// ANCHOR this is our functions that only work for ONE comapanion
// ANCHOR ⚠️⚠️ WARNING unrefactored code below

function buyWolf() {
    // TODO do I have enough gold to purchase???
    // TODO set my availableturns to the amnt of purchasableTurns
    const wolf = companions[0]
    if (hero.gold >= wolf.cost) {
        wolf.turnsAvailable = wolf.purchasableTurns
        hero.gold -= wolf.cost
        update()
    } else {
        window.alert("You don't have enough gold!")
    }
    console.log('buying wolf', wolf);
}

function wolfAttack() {
    // TODO have I purchased the wolf????? check the turns available
    // TODO is turns available greater than 0
    // TODO apply companion.....attack the boss
    // TODO take away one of my turns
    const wolf = companions.find(companion => companion.name == 'wolf')
    if (wolf.turnsAvailable > 0) {
        boss.hp -= wolf.value
        console.log('attacking the boss', boss);
        wolf.turnsAvailable--
        console.log('wolf turns', wolf);
        update()
    }
}

// setInterval(wolfAttack, 1000)


function buyUnicorn() {
    const unicorn = companions.find(c => c.name == 'unicorn')
    if (hero.gold < unicorn.cost) {
        window.alert("You don't have enough!")
        return
    }
    unicorn.turnsAvailable = unicorn.purchasableTurns
    hero.gold -= unicorn.cost
    console.log('buying unicorn', unicorn);
    update()
}

function unicornHeal() {
    // TODO did I purchase the unicorn?? check the turns available
    // TODO if turnsAvailable > 0
    // TODO apply companion....heal hero
    // TODO decrement turns available
    const unicorn = companions.find(c => c.name == 'unicorn')
    if (unicorn.turnsAvailable > 0) {
        hero.hp += unicorn.value
        unicorn.turnsAvailable--
        update()
    }
}

// setInterval(unicornHeal, 1000)

// #endregion