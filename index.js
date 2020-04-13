const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const nodeCache = require('node-cache');
const stdTTL = 30;
const myCache = new nodeCache({stdTTL, checkperiod: 60});

const app = express();

const timOnEachTeam = {
  'TDJ8STMFE': 'U2U3DH06N',
  'T2TJSK16K': 'U2U3DH06N'
};

app.use(bodyParser());
app.post('/', function (req, res) {
  const body = req.body;
  if (!body) {
    res.status(200).send({});
    return;
  }
  if (body && body.type === 'url_verification') {
    res.status(200).send({ challenge: body.challenge });
    return;
  }
  const event = body ? body.event : null;
  let tim = timOnEachTeam[event.team];
    
  if (typeof event.text === 'string' && event.text.indexOf(tim) > -1) {
    messageAsTim(body.token, event, (err, result) => {
      res.status(200).send({err: err, result: result});
      return;
    });

  }
  else {
    res.status(200).send('OK')
  }

})

function messageAsTim(token, event, cb) {
  if (typeof event !== 'object') return cb();


  const body = JSON.stringify({
    channel: event.channel,
    text: `${determineMessage(event)} <@${event.user}>!`,
    thread_ts: event.thread_ts || undefined
  })

  request.post('https://slack.com/api/chat.postMessage', {
    body,
    headers: {
      'Authorization': `Bearer ${process.env.TOKEN}`,
      'Content-Type': 'application/json' }
  }, (err, result) => {
    if (err) {
      cb(err);
      return;
    }
    let userMessageCount = myCache.get(event.user);
    const numMessages = userMessageCount ? userMessageCount + 1 : 1;
    myCache.set(event.user, numMessages);

    cb(null, result)
  })
}

function determineMessage(event){
    const eventText = event.text.toLowerCase().replace(/[ \'\"]/g, '');
    
    const IS_THANKS_MESSAGE = [
        'thanks',
        'thx',
        'thankyou'
    ].find(phrase => eventText.indexOf(phrase) > -1);

    const IS_DONUTS_MESSAGE = [
        'donuts',
        'doughnuts'
    ].find(phrase => eventText.indexOf(phrase) > -1);

    const IS_BACON_MESSAGE = [
        'bacon'
    ].find(phrase => eventText.indexOf(phrase) > -1);
    
    const IS_BYE_MESSAGE = [
	'bye',
	'timetoleave',
	'timetogo'	
    ].find(phrase => eventText.indexOf(phrase) > -1);    
    
    const IS_THAT_A_FACT = [
	'areyousure',
	'isthattrue',
	'idontbelieveyou'    
    ].find(phrase => eventText.indexOf(phrase) > -1);   
    
	const IS_CAPYBARA_FACT = [
	 'capybara'
	].find(phrase => eventText.indexOf(phrase) > -1);   
	
    const IS_BRAD_FACT = [
	'fact',
	'faq'
	].find(phrase => eventText.indexOf(phrase) > -1);    
    
    const IS_BRAD_WRATH = [
		'autobots',
		'rollout!',
		'optimus',
		'prime',
		'transformers',
		'megatron',
		'cybertron',
		'allspark',
		'decepticons',
		'bumblebee'
    ].find(phrase => eventText.indexOf(phrase) > -1);    
    
    const ARE_PET_PEEVES = [
		'peeve',
		'annoys',
		'bothers'		
    ].find(phrase => eventText.indexOf(phrase) > -1);    
	
    const IS_TELL_JOKE = [
		'tellmeajoke',
		'knowanyjokes'
    ].find(phrase => eventText.indexOf(phrase) > -1);  
	
	const IS_KNOCK_KNOCK = [
		'knockknock'
    ].find(phrase => eventText.indexOf(phrase) > -1);  
	
    const IS_WHOS_THERE = [
		'whosthere',
		'whoisthere',
		'whosethere',
		'whobethere'
    ].find(phrase => eventText.indexOf(phrase) > -1); 
	
    const IS_TRUTH = [
    	'truths',
		'wisdom',
		'sayings',
		'potato'
    ].find(phrase => eventText.indexOf(phrase) > -1); 
	
    let listToUse;
    const BRAD_BOT_ABUSE  = [
		'Cool it now, I have other things to do besides receive your praise,',
		'Ok, this has been fun, but you should probably get back to work now,',
		'I heard you the first time, Geeze!',
		`Keep this up and you'll burn through my free Heroku plan!`,
		'Stop talking to me', 
		'Seriously, stop talking',
		`Here are the latest rain forest test results: "You are a horrible person." That's what it says: a horrible person. We weren't even testing for that.`,
		`Okay, look; we both said a lot of things you're going to regret, but I think we can put our difference behind us. For science. You monster.`
    ];
	
    const SPENCER_MESSAGES = [
        'Just doing your job',
        'Even you could have done that',
        'Thanks, I sacrificed many lives for it',
        'Thanks, but I prefer not to be noticed for my intellectual superiority',
        `Give me a pen and I'll give you my autograph`,
        'Why',
        ':expressionless:',
        ':fp:',
        'Did somebody forget to feed the',
        'Could someone please take care of',
        'Did you actually pay for that haircut',
        'I thought that the judge also said that you could not talk to me',
        'Did you dress in the dark today',
        'Oh, are you still here', 
		'You should have worn the brown pants today',
        'Dude. Deodorant.',
        'Anyone else smell that? Wait... it is just',
		'I hate you',
		'Shut it',
		'Shut your pie hole',
		'You did NOT just say that',
		`I can't believe you just said that`,
		'Are you trying to annoy me',
		'May your headphones snag on every door handle',
		`May you press 'A' too hastily and be forced to speak with the nurse at the Pokemon Center all over again`,
		'May you forever feel your cell phone vibrating in the pocket it is not even in',
		'May the chocolate chips in your cookies always turn out to be raisins',
		`May your tea be too hot when you receive it, and too cold by the time you remember it's there`,
		'May your chair product a sound similar to a fart, but only once, such that you cannot reproduce it to prove that it was just the chair',
		'May you never be quite certain as to whether that pressure is a fart or a poop',
		`It says so right here in your personnel file: Unlikable. Liked by no one. A bitter, unlikable loner who's passing shall not be mourned.`,
		`I don't want to tell you your business, but if I were you, I'd leave me alone.`,
		`You know, Awesome ends with me, and Ugly begins with U.`,
		`Do your neighbors file a noise complaint every time you breathe?`,
		`I envy people who haven't met you.`,
		`You look like a before picture...`		
    ];

    const BYE_MESSAGES = [
        'Bye',
        'Laters',
        'Peace out',
        'I\'m out',
        'Toodles',
        'TTFN',
        'Sayonara',
        'Aloha',
        'Fare thee well',
        'Arrivederci',
        'Da Svedanya',
        'Adios',
        'Byeeeeeeeeeee',
        'Live long and prosper',
        'Bye Felicia, I mean',
        `I'm out`,
        `Job's done.`,
	'May the Force be with you'	    
    ];
    const THANKS_MESSAGES = [
        `You're welcome`,
        'No problem',
        'Much appreciated',
        `All in a day's work`,
        'I appreciate you,',
        'No problemo,',
        'Happy to help,',
        'Easy peasy,',
        'Easy peasy lemon squeezy,',
        'My pleasure,',
        'You got it,',
        'You got it, dude',
        `Don't mention it,`,
        'Not a problem',
        'It was nothing,',
        `I'm happy to help,`,
        'Anytime',
        'You got it,',
        'Oh, anytime',
        'It was the least I could do',
        'Think nothing of it,',
        'At your service,',
        'By all means,',
        'Anything for you,',
        'Glad I could help,',
        `It's my duty,`,
        'Glad to be of any assistance,',
        `It's all good,`,
        'Sure thing,',
        'No worries',
        'Helping is my business, and business is good!',
        'De nada',
        `Ain't no thang`
    ];

    const DONUT_MESSAGES = [
        'QT has great donuts',
        'Why not go to McDonalds for those donuts,',
        'I recommend finding donutless donuts,',
        'Donuts with sprinkles - hold the donut, sprinkles on the side,',
        'I also have a bag of just gluten, I can make some pretty decent keto doughnuts with it,',
        'I brought in some keto doughnuts, with extra gluten! Just for you,',
        'I bet you would love some Active donuts,',
        'Would you like a :fist: Hurtz Donut,',
        'DONUT TELL ME WHAT TO DO',
		`click here: https://lmgtfy.com/?q=worst+donuts+near+me&s=g`,
        'My tummy feels funny.'
    ];
    
    const TRUTH_MESSAGES = [
		`You're the only one holding yourself back`,
		'The world owes you absolutely nothing',
		`Investing in yourself isn't selfish`,
		`What other people think of you really doesn't matter`,
		`You don't have to please everyone`,
		`Comparing your Chapter 1 with someone else's Chapter 9 is pure stupidity`,
		`There's another way.  There always is`,
		'A negative opinion always hits harder than a positive one',
		'Your ideas are useless if not implemented',
		`It's not what you say, It's what they hear`,
		`Good enough isn't good enough if it can be better`,
		`Try a little harder.  You'll be glad you did`,
		'Failure is a chance to restart',
		`Most of the time the people who talk about how hard they work don't actually work that hard`,
		`Just because you're busy doesn't mean you're accomplishing something`,
		'The world is full of idiots who think they are geniuses',
		`You're unique.  Just like everyone else`,
		`You're ridiculously average, at best`,
		'You know a lot less than what you think you do',
		'You cannot control lige, but you can change the way you see life',
		'Life will not be perfect',
		`Most of us don't know how to say 'No'`,
		'People will hate you for no reason',
		'Nobody is actually too busy to respond to you',
		`People won't always be nice to you`,
		'Your friends will talk behind your back at times',
		'People will use you',
		'We always tend to find a person to blame no matter what',
		`The life you're living right now is a dream for many people`,
		'Money can buy happiness',
		'Some people are just not meant to stay in your life, no matter how bad you want them to',
		`You'll find many people together, but not in love.  You'll find many people in love, but not together`,
		'Life of other will continue without you',
		'Life is a solo trip with lots of visitors',
		'Nobody really cares about how difficult your life is',
		'Your actions define you, not your thoughts',
		'We spend time worrying about the losses and not about the gains we have',
		'Almost no one practices what they preach',
		`You don't have to wait for an apology to forgive`,
		'One day everything will end',
		`Following rules doesn't always guarantee success`,
		'People ruin the happiness of other just because they cannnot find their own',
		'You rarely get a second chance',
		'You usually have to options. To stay or to dare',
		`Everyone's biased towards someone or something`,
		'People will always judge you'	
    ];
	
    const BACON_MESSAGES = [
        'mmmm.... bacon!',
        'Did someone say bacon?',
        ':bacon:',
        ':alert_bacon:',
        `IT'S BACON!!!`,
		'Is it nice, my preciousss? Is it juicy? Is it scrumptiously crunchable?',
		'I heard that Brad was bringing bacon tomorrow.'
    ];
    const CAPYBARA_FACTS = [
	'Like beavers, capybaras are strong swimmers.',
      	'Capybara toes are partially webbed.',
      	'Capybara fur is reddish to dark brown and is long and brittle.',
      	'The largest rodent on Earth is the Capybara.',
      	'Capybara are found throughout much of northern and central South America, though a small invasive population has been seen in Florida.',
      	`Like other rodents, capybaras’ teeth grow continuously, and they wear them down by grazing on aquatic plants, grasses, and other plentiful plants.`,
      	`Capybaras eat their own feces in the morning. That’s when their poo is protein rich from the high number of microbes digesting the previous day’s meals. Because the grasses they eat are so hard to digest, eating their waste essentially allows them to digest it twice.`,
      	'Capybara are closely related to guinea pigs and rock cavies, and more distantly related to chinchillas and agouti.',
      	`Capybara's pig-shaped bodies are adapted for life in bodies of water found in forests, seasonally flooded savannas, and wetlands.`,
      	'Capybaras sleep very little, usually napping throughout the day and grazing into and through the night.',
      	'Capybaras can stay underwater for up to five minutes at a time, according to the San Diego Zoo.',
      	`The scientific name for capybara comes from Hydro chaeris, which means 'water hog' in Greek.`,
      	`An Amazon tribe calls the capybara Kapiyva or 'master of the grasses' in their native language.`
    ];
	
    const BRAD_FACTS = [
      	`A type of 'immortal' jellyfish is capable of cheating death indefinitely.`,
      	'Octopuses have three hearts.',
      	'Butterflies can taste with their feet.',
      	'Cats and horses are highly susceptible to black widow venom, but dogs are relatively resistant. Sheep and rabbits are apparently immune.',
      	'Sharks kill fewer than 10 people per year. Humans kill about 100 million sharks per year.',
      	'Wild dolphins call each other by name.',
      	'Young goats pick up accents from each other.',
      	`Humpback whale songs spread like 'cultural ripples from one population to another.'`,
      	'Tardigrades are extremely durable microscopic animals that exist all over Earth. They can survive any of the following: 300 degrees Fahrenheit (149 Celsius), -458 degrees F (-272 C), the vacuum of space, pressure six times stronger than the ocean floor and more than a decade without food.',
      	'Horses use facial expressions to communicate with each other.',
      	`Elephants have a specific alarm call that means 'human.'`,
      	`Squirrels can't burp or vomit.`,
      	'Less time separates the existence of humans and the tyrannosaurus rex than the T-rex and the stegosaurus.',
      	`There's a place on Earth where seagulls prey on right whales.`,
      	`Owls don't have eyeballs. They have eye tubes.`,
      	'Animals with smaller bodies and faster metabolism see in slow motion.',
      	`Dogs' sense of smell is about 100,000 times stronger than humans', but they have just one-sixth our number of taste buds.`,
      	'The extinct colossus penguin stood as tall as LeBron James.',
      	`Male gentoo and Adelie penguins 'propose' to females by giving them a pebble.`,
      	`Azara's owl monkeys are more monogamous than humans.`,
      	`Barn owls are normally monogamous, but about 25 percent of mated pairs 'divorce.'`,
      	'A group of parrots is known as a pandemonium.',
      	'Polar bears have black skin.',
      	'Reindeer eyeballs turn blue in winter to help them see at lower light levels.',
      	'A human brain operates on about 15 watts.',
      	'Warmer weather causes more turtles to be born female than male.',
      	'African buffalo herds display voting behavior, in which individuals register their travel preference by standing up, looking in one direction and then lying back down. Only adult females can vote.',
      	'If a honeybee keeps waggle dancing in favor of an unpopular nesting site, other workers headbutt her to help the colony reach a consensus.',
      	'Honeybees can flap their wings 200 times every second.',
      	'The claws of a mantis shrimp can accelerate as quickly as a .22-caliber bullet.',
      	'A single strand of spider silk is thinner than a human hair, but also five times stronger than steel of the same width. A rope just 2 inches thick could reportedly stop a Boeing 747.',
      	`A supercolony of invasive Argentine ants, known as the 'California large', covers 560 miles of the U.S. West Coast. It's currently engaged in a turf war with a nearby supercolony in Mexico.`,
      	'The recently discovered bone-house wasp stuffs the walls of its nest with dead ants.',
      	'By eating pest insects, bats save the U.S. agriculture industry an estimated $3 billion per year.',
      	'Fourteen new species of dancing frogs were discovered in 2014, raising the global number of known dancing-frog species to 24.',
      	'A sea lion is the first nonhuman mammal with a proven ability to keep a beat.',
      	'Humans can survive underwater. But not for very long.',
    ];	
    const BRAD_WRATH = [
        'Autobots! Roll out!',
        'Freedom is the right of all sentient beings',
        `Until I return I'm leaving you in command. I know you won’t let me down`,
        'This universe, no matter how vast will never be big enough for you and I to coexist',
        'Above all, do not lament my absence, for in my spark, I know that this is not the end, but merely a new beginning. Simply put, another transformation',
        `It’s been an honor serving with you`
    ];
	const KNOCK_KNOCK = [
		'Ok, knock-knock',
		'Knock-knock'
	];	
    const IS_THAT_A_FACT_MESSAGE = [
	'Do you doubt me?',
	'Google it.  I dare you.',
	'Prove me wrong.',
	'You dare question me?',
	'Oh geez. A non-believer...',
	`Of course it's true.`,
	'Would I lie to you',
	'Until you prove it otherwise',
	'It must be, I saw it on the interwebs this morning.',
	`Well, I'm not an expert on it, but I did stay at a Holiday Inn last night`,
	'Yes',
	'No',
	'Maybe',
	'Certainly',
	'Without a doubt',
	'Most likely',
	'Signs point to yes',
	'According to the prophesy, yes.',
	'Are you calling me a liar?'  
    ];
    const PET_PEVES_LIST = [
	'My pet peeve is people who clip their nails at work',
	'My pet peeve is people who chew loudly',
	'My pet peeve is people doing burpies by me',	
	'My pet peeve is people who pull in front of me only to slow down and turn - when they could have pulled in behind me!',
	`My pet peeve is people who don't use their turn signal`,
	`My pet peeve is people who start sentences with 'So...'`,
	`My pet peeve is people who talk loudly. I'm looking at you @cjweipert!`,
	'My pet peeve is people whose desks are filled with video game characters',
	'People who walk slowly or stop suddenly in the middle of the sidewalk',
	'People who block the aisle at the grocery store',
	'People who open the clear glass doors at the grocery store to see what is in the freezer!',
	'Being called Brian',
	'My pet peeve is being interrupted when having a conversation with someone',
	'My pet peeve is when people invite themselves in to a conversation I am having with someone else',	
	'My pet peeve is when whoever creates these responses sullies my name by leaving a typo in there.'
	];
    const TELL_JOKE = [
	`A guy goes in for a job interview and sits down with the boss.  The boss asks him, “What do you think is your worst quality?” The man says “I’m probably too honest.” The boss says, “That’s not a bad thing, I think being honest is a good quality.”The man replies, “I don’t care about what you think!”`,
	`My memory has gotten so bad it has actually caused me to lose my job. I’m still employed. I just can’t remember where.`,
	`Some people say the glass is half full. Some people say the glass is half empty. Engineers say the glass is twice as big as necessary.`,
	`I asked the corporate wellness officer, “Can you teach me yoga?” He said, “How flexible are you?” I said, “I can’t make Tuesdays.”`,
	`My boss says I have a preoccupation with vengeance. We’ll see about that.`,
	`The reason we “nod off to sleep” is so it looks like we’re just emphatically agreeing with everything when we’re in a boring meeting.`,
	`When an employment application asks who is to be notified in case of emergency, I always write, “A very good doctor”.`,
	`Team work is important; it helps to put the blame on someone else.`,
	`I’m great at multitasking. I can waste time, be unproductive, and procrastinate all at once.`,
	`Nothing ruins a Friday more than an understanding that today is Tuesday.`,
	`I can’t believe I got fired from the calendar factory. All I did was take a day off.`,
	`I always tell new hires, don’t think of me as your boss, think of me as a friend who can fire you.`,
	`My resumé is just a list of things I hope you never ask me to do.`,
	`The proper way to use a stress ball is to throw it at the last person to upset you.`,
	`There is a new trend in our office; everyone is putting names on their food. I saw it today, while I was eating a sandwich named Kevin.`,
	`My annual performance review says I lack “passion and intensity.” I guess management hasn’t seen me alone with a Big Mac.`,
	`I get plenty of exercise – jumping to conclusions, pushing my luck, and dodging deadlines.`,
	`How do construction workers party? They raise the roof.`,
	`If every day is a gift, I’d like a receipt for Monday. I want to exchange it for another Friday.`,
	`Feeling stressed out? Make a nice cup of hot tea and then spill it in the lap of whoever’s bugging you.`,
	`I use artificial sweetener at work. I add it to everything I say to my boss.`,
	`A clean desk is a sign of a cluttered desk drawer.`,
	`The only thing worse than seeing something done wrong is seeing it done slowly.`,
	`If at first you don’t succeed, redefine success.`,
	`Give me ambiguity or give me something else.`,
	`We have enough youth. How about a fountain of “Smart”?`,
	`I started out with nothing and I still have most of it.`,
	`The boss frowns on anyone yelling: “Hey Weirdo!” He says too many people look up from their work.`,
	`Things really haven’t gotten worse. We’ve just improved our inter-departmental communication skills.`,
	`Anything that could possibly go wrong often does – as well as a thing or two that couldn’t possibly.`,
	`If it wasn’t for the last minute, nothing would get done.`,
	`If our boss makes a mistake, it is our mistake.`,
	`A diplomat is someone who can tell you to go to hell in such a way that you will look forward to the trip.`,
	`To steal ideas from one person is plagiarism. To steal from many is research.`,
	`A bus station is where a bus stops. A train station is where a train stops. On my desk, I have a work station…`,
	`I like work. It fascinates me. I sit and look at it for hours.`,
	`I’m out of bed and dressed. What more do you want?`,
	`Experience is what you get when you didn’t get what you wanted.`,
	`To be sure of hitting the target, shoot first and call whatever you hit the target.`,
	`To err is human, to blame it on someone else shows management potential.`,
	`A man can do more than he thinks he can, but he usually does less than he thinks he does.`,
	`I don’t work well under pressure… or any other circumstance.`,
	`Knowledge is knowing a tomato is a fruit; wisdom is not putting it in a fruit salad.`,
	`I thought I wanted a career, turns out I just wanted paychecks`,
	`Some people are like Slinkies … not really good for anything, but you can’t help smiling when you see one tumble down the stairs.`,
	`A work week is so rough that after Monday and Tuesday, even the calendar says WTF.`,
	`I didn’t say it was your fault, I said I was blaming you.`,
	`Laugh at your problems, everybody else does.`,
	`Artificial intelligence is no match for natural stupidity.`,
	`He who smiles in a crisis has found someone to blame.`,
	`Some cause happiness wherever they go. Others whenever they go.`,
	`Worrying works! 90% of the things I worry about never happen.`,
	`I couldn’t work today because of an eye problem. I just can’t see myself working today.`,
	`When in doubt, mumble.`,
	`You’re never too old to learn something stupid.`,
	`When tempted to fight fire with fire, remember that the Fire Department usually uses water.`,
	`When it comes to work, change is inevitable, except from the vending machine.`,
	`If you keep your feet firmly on the ground, you’ll have trouble putting on your pants.`,
	`Some mistakes are too much fun to only make once.`,
	`Keep the dream alive: hit the snooze button.`,
	`If you can stay calm while all around you is chaos, then you probably haven’t completely understood the situation.`,
	`Hard work never killed anyone, but why take the chance?`,
	`I have all the money I’ll ever need – if I die by 4:00 p.m. today.`,
	`The right to be heard does not automatically include the right to be taken seriously.`,
	`Archaeologist: someone whose career lies in ruins.`,
	`The probability of someone watching you is proportional to the stupidity of your action.`,
	`It matters not whether you win or lose: what matters is whether I win or lose.`,
	`If you can’t convince them, confuse them.`,
	`Progress is made by lazy people looking for an easier way to do things.`,
	`I don’t have a solution, but I do admire the problem.`,
	`People tend to make rules for others and exceptions for themselves.`,
	`Stress is when you wake up screaming and you realize you haven’t fallen asleep yet.`,
	`Sometimes the best helping hand you can give is a good, firm push.`,
	`Drink coffee! Do stupid things faster with more energy!`,
	`I don’t mind coming to work, it’s the 8-hour wait to go home I can’t stand.`,
	`A positive attitude may not solve all your problems, but it will annoy enough people to make it worth the effort.`,
	`The trouble with being punctual is that nobody’s there to appreciate it.`,
	`Just about the time when you think you can make ends meet, somebody moves the ends.`,
	`My biggest professional ambition is to get a desk where no one can see my computer monitor but me.`,
	`A committee is twelve men doing the work of one.`,
	`If everything seems to be coming your way, you’re probably in the wrong lane.`,
	`It’s not how good your work is, it’s how well you explain it.`,
	`Efficiency is a highly developed form of laziness.`,
	`The farther away the future is, the better it looks.`,
	`Some of us learn from the mistakes of others; the rest of us have to be the others.`,
	`Discretion is being able to raise your eyebrow instead of your voice.`,
	`I pretend to work as long as they pretend to pay me.`,
	`I like my job only marginally more than I like being homeless.`,
	`The trouble with doing something right the first time is that nobody appreciates how difficult it was.`,
	`The human brain is a wonderful thing. It starts working the moment you are born, and never stops until you stand up to speak in public.`,
	`Do not walk behind me, for I may not lead. Do not walk ahead of me, for I may not follow. Do not walk beside me either. Just pretty much leave me alone.`,
	`There are two kinds of people who don’t say much: those who are quiet and those who talk a lot.`,
	`With a calendar, your days are numbered.`,
	`A hard thing about a business is minding your own.`,
	`I think they picked me for my motivational skills. Everyone always says they have to work twice as hard when I’m around!`,
	`Early to bed, early to rise makes people suspicious.`,
	`Many people quit looking for work when they find a job.`,
	`All I ask is a chance to prove money can’t make me happy.`,
	`It’s not who you know, it’s whom you know.`,
	`Nothing is foolproof to a sufficiently talented fool.`,
	`I have a lot of jokes about unemployed people but none of them work.`,
	'Look in the mirror',
	'7 percent of all statistics are made up on the spot.',
	'Do you want to know how keep a moron in suspense?'    
    ];
    const WHOS_THERE = [
	'Seriously, you thought I was going to tell a knock knock joke?',
	`Shouldn't you be working rather than trying to get a bot to tell you knock-knock jokes?`,
	'You must really be desperate for something to do if you expect me to keep you entertained.',
	`"kNoCk KnOcK!" Durr!`    
    ];	    
    if (bradAbuseDetected(event.user)){
        listToUse = BRAD_BOT_ABUSE;
    }	
	else if ((event.user.indexOf('UGACR0GE4') > -1) || (event.user.indexOf('U9Z6ZMZPT') > -1)) {
		listToUse = SPENCER.MESSAGES;
	}
    else if (IS_THANKS_MESSAGE){
		listToUse = THANKS_MESSAGES;
    }
    else if (IS_DONUTS_MESSAGE){
        listToUse = DONUT_MESSAGES;
    }
    else if (IS_BACON_MESSAGE) {
        listToUse = BACON_MESSAGES;
    }
    else if (IS_BYE_MESSAGE) {
        listToUse = BYE_MESSAGES;   
    }
    else if (IS_BRAD_FACT) {
		listToUse = BRAD_FACTS;
    }
    else if (IS_BRAD_WRATH) {
		listToUse = BRAD_WRATH;
    }
	else if (IS_KNOCK_KNOCK) {
		listToUse = KNOCK_KNOCK;
    }
    else if (IS_THAT_A_FACT) {
		listToUse = IS_THAT_A_FACT_MESSAGE;
    } 
    else if (IS_CAPYBARA_FACT) {
		listToUse = CAPYBARA_FACTS;	
	}	
    else if (IS_TELL_JOKE) {
		listToUse = TELL_JOKE;
    }
    else if (ARE_PET_PEEVES) {
		listToUse = PET_PEVES_LIST;	
    }	
    else if (IS_WHOS_THERE) {
		listToUse = WHOS_THERE;
    }	    
		else if (IS_TRUTH) {
	listToUse = TRUTH_MESSAGES;
    }	
    return listToUse[Math.floor(Math.random() * listToUse.length)];
}

function bradAbuseDetected(user){
    const userMessageCount = myCache.get(user);
    if (userMessageCount && userMessageCount >= 3){
        return true;
    }
    return false;
}

app.listen(process.env.PORT || 4747, () => console.log('Server is live and good'));
