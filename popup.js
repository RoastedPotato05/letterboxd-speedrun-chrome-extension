// popup.js
const startInput = document.getElementById("search-start");
const goalInput = document.getElementById("search-goal");
const randomStart = document.getElementById("random-start");
const randomGoal = document.getElementById("random-goal");
const stopwatch = document.getElementById("stopwatch");
const startRunBtn = document.getElementById("start-run");
const searchBlock = document.getElementById("search-block");
const returnBtn = document.getElementById("return");
const saveBtn = document.getElementById("save");
const statsReturnBtn = document.getElementById("stats-return");
const clearStatsBtn = document.getElementById("clear-stats");
const runDisplay = document.getElementById("run-display");
const statsDisplay = document.getElementById("stats-display");
const statsBarsNums = document.getElementById("stats-bars-nums");
const statsBars = document.getElementById("stats-bars");
const statsBarsItems = document.getElementById("stats-bars-items");
const startBtns = document.getElementById("start-buttons");
const endBtns = document.getElementById("end-buttons");
const statsBtns = document.getElementById("stats-buttons");
const randomBtn = document.getElementById("random");
const dicePng = document.getElementById("dice-png");
const randomText = document.getElementById("random-text");
const statsBtn = document.getElementById("stats");
const exitBtn = document.getElementById("exit");
const exitDiv = document.getElementById("exit-div");
const githubLink = document.getElementById("github-link");
const letterboxdLink = document.getElementById("letterboxd-link");

let randomHTML;
let randomStyle;
let startTime;
let updatedTime;
let difference = 0;
let data;
let tInterval;
let movies = {};
let actors = ["https://letterboxd.com/actor/brad-pitt/","https://letterboxd.com/actor/edward-norton/","https://letterboxd.com/actor/helena-bonham-carter/","https://letterboxd.com/actor/meat-loaf/","https://letterboxd.com/actor/jared-leto/","https://letterboxd.com/actor/morgan-freeman/","https://letterboxd.com/actor/gwyneth-paltrow/","https://letterboxd.com/actor/kevin-spacey/","https://letterboxd.com/actor/john-cassini/","https://letterboxd.com/actor/melanie-laurent/","https://letterboxd.com/actor/christoph-waltz/","https://letterboxd.com/actor/eli-roth/","https://letterboxd.com/actor/michael-fassbender/","https://letterboxd.com/actor/leonardo-dicaprio/","https://letterboxd.com/actor/margot-robbie/","https://letterboxd.com/actor/emile-hirsch/","https://letterboxd.com/actor/margaret-qualley/","https://letterboxd.com/actor/joey-king/","https://letterboxd.com/actor/aaron-taylor-johnson/","https://letterboxd.com/actor/brian-tyree-henry/","https://letterboxd.com/actor/andrew-koji/","https://letterboxd.com/actor/ralph-fiennes/","https://letterboxd.com/actor/f-murray-abraham/","https://letterboxd.com/actor/mathieu-amalric/","https://letterboxd.com/actor/adrien-brody/","https://letterboxd.com/actor/willem-dafoe/","https://letterboxd.com/actor/daniel-craig/","https://letterboxd.com/actor/janelle-monae/","https://letterboxd.com/actor/kathryn-hahn/","https://letterboxd.com/actor/leslie-odom-jr/","https://letterboxd.com/actor/jason-schwartzman/","https://letterboxd.com/actor/scarlett-johansson/","https://letterboxd.com/actor/tom-hanks/","https://letterboxd.com/actor/jeffrey-wright/","https://letterboxd.com/actor/tilda-swinton/","https://letterboxd.com/actor/timothee-chalamet/","https://letterboxd.com/actor/elle-fanning/","https://letterboxd.com/actor/monica-barbaro/","https://letterboxd.com/actor/scoot-mcnairy/","https://letterboxd.com/actor/daniel-radcliffe/","https://letterboxd.com/actor/emma-watson/","https://letterboxd.com/actor/rupert-grint/","https://letterboxd.com/actor/alan-rickman/","https://letterboxd.com/actor/imelda-staunton/","https://letterboxd.com/actor/johnny-depp/","https://letterboxd.com/actor/emily-watson/","https://letterboxd.com/actor/tracey-ullman/","https://letterboxd.com/actor/paul-whitehouse/","https://letterboxd.com/actor/jim-broadbent/","https://letterboxd.com/actor/michael-gambon/","https://letterboxd.com/actor/tim-curry/","https://letterboxd.com/actor/susan-sarandon/","https://letterboxd.com/actor/barry-bostwick/","https://letterboxd.com/actor/richard-obrien-1/","https://letterboxd.com/actor/patricia-quinn/","https://letterboxd.com/actor/seth-rogen/","https://letterboxd.com/actor/kristen-wiig/","https://letterboxd.com/actor/jonah-hill/","https://letterboxd.com/actor/bill-hader/","https://letterboxd.com/actor/michael-cera/","https://letterboxd.com/actor/mike-myers/","https://letterboxd.com/actor/dana-carvey/","https://letterboxd.com/actor/rob-lowe/","https://letterboxd.com/actor/tia-carrere/","https://letterboxd.com/actor/lara-flynn-boyle/","https://letterboxd.com/actor/jack-black-1/","https://letterboxd.com/actor/kyle-gass/","https://letterboxd.com/actor/jr-reed/","https://letterboxd.com/actor/ronnie-james-dio/","https://letterboxd.com/actor/paul-f-tompkins-1/","https://letterboxd.com/actor/christian-bale/","https://letterboxd.com/actor/justin-theroux/","https://letterboxd.com/actor/josh-lucas/","https://letterboxd.com/actor/bill-sage/","https://letterboxd.com/actor/chloe-sevigny/","https://letterboxd.com/actor/ryan-gosling/","https://letterboxd.com/actor/harrison-ford/","https://letterboxd.com/actor/contributor:151128/","https://letterboxd.com/actor/dave-bautista/","https://letterboxd.com/actor/robin-wright/","https://letterboxd.com/actor/ellen-burstyn/","https://letterboxd.com/actor/jennifer-connelly/","https://letterboxd.com/actor/marlon-wayans/","https://letterboxd.com/actor/christopher-mcdonald/","https://letterboxd.com/actor/winona-ryder/","https://letterboxd.com/actor/angelina-jolie/","https://letterboxd.com/actor/clea-duvall/","https://letterboxd.com/actor/brittany-murphy/","https://letterboxd.com/actor/elisabeth-moss/","https://letterboxd.com/actor/heath-ledger/","https://letterboxd.com/actor/aaron-eckhart/","https://letterboxd.com/actor/michael-caine/","https://letterboxd.com/actor/maggie-gyllenhaal/","https://letterboxd.com/actor/tim-robbins/","https://letterboxd.com/actor/bob-gunton/","https://letterboxd.com/actor/william-sadler/","https://letterboxd.com/actor/clancy-brown/","https://letterboxd.com/actor/liam-neeson/","https://letterboxd.com/actor/katie-holmes/","https://letterboxd.com/actor/gary-oldman/", "https://letterboxd.com/actor/tom-hardy/","https://letterboxd.com/actor/joseph-gordon-levitt/","https://letterboxd.com/actor/anne-hathaway/","https://letterboxd.com/actor/robert-downey-jr/","https://letterboxd.com/actor/chris-evans/","https://letterboxd.com/actor/chris-hemsworth/","https://letterboxd.com/actor/josh-brolin/","https://letterboxd.com/actor/mark-ruffalo/","https://letterboxd.com/actor/odessa-azion/","https://letterboxd.com/actor/kevin-oleary-3/","https://letterboxd.com/actor/tyler-the-creator/","https://letterboxd.com/actor/tom-holland-4/","https://letterboxd.com/actor/michael-keaton/","https://letterboxd.com/actor/marisa-tomei/","https://letterboxd.com/actor/jon-favreau/","https://letterboxd.com/actor/ansel-elgort/","https://letterboxd.com/actor/lily-james/","https://letterboxd.com/actor/jon-hamm/","https://letterboxd.com/actor/jamie-foxx/","https://letterboxd.com/actor/annette-bening/","https://letterboxd.com/actor/thora-birch/","https://letterboxd.com/actor/wes-bentley/","https://letterboxd.com/actor/mena-suvari/","https://letterboxd.com/actor/stephen-baldwin/","https://letterboxd.com/actor/gabriel-byrne/","https://letterboxd.com/actor/benicio-del-toro/","https://letterboxd.com/actor/kevin-pollak/","https://letterboxd.com/actor/dave-foley/","https://letterboxd.com/actor/julia-louis-dreyfus/","https://letterboxd.com/actor/hayden-panettiere/","https://letterboxd.com/actor/phyllis-diller/","https://letterboxd.com/actor/michael-douglas/","https://letterboxd.com/actor/sean-penn/","https://letterboxd.com/actor/deborah-kara-unger/","https://letterboxd.com/actor/james-rebhorn/","https://letterboxd.com/actor/peter-donat/","https://letterboxd.com/actor/jamie-lee-curtis/","https://letterboxd.com/actor/josh-hartnett/","https://letterboxd.com/actor/adam-arkin-1/","https://letterboxd.com/actor/michelle-williams/","https://letterboxd.com/actor/adam-hann-byrd/","https://letterboxd.com/actor/halle-berry/","https://letterboxd.com/actor/benjamin-bratt/","https://letterboxd.com/actor/sharon-stone/","https://letterboxd.com/actor/lambert-wilson/","https://letterboxd.com/actor/frances-conroy/","https://letterboxd.com/actor/josh-hamilton/","https://letterboxd.com/actor/bruce-ramsay/","https://letterboxd.com/actor/ethan-hawke/","https://letterboxd.com/actor/vincent-spano/","https://letterboxd.com/actor/john-newton/","https://letterboxd.com/actor/jesse-eisenberg/","https://letterboxd.com/actor/woody-harrelson/","https://letterboxd.com/actor/isla-fisher/","https://letterboxd.com/actor/dave-franco/","https://letterboxd.com/actor/jake-gyllenhaal/","https://letterboxd.com/actor/sarah-gadon-1/","https://letterboxd.com/actor/isabella-rossellini/","https://letterboxd.com/actor/joshua-peace/","https://letterboxd.com/actor/adam-sandler/","https://letterboxd.com/actor/jennifer-aniston/","https://letterboxd.com/actor/mark-strong/","https://letterboxd.com/actor/jodie-turner-smith/","https://letterboxd.com/actor/ryan-reynolds/","https://letterboxd.com/actor/manuel-garcia-rulfo/","https://letterboxd.com/actor/ben-hardy/","https://letterboxd.com/actor/adria-arjona/","https://letterboxd.com/actor/kerry-washington/","https://letterboxd.com/actor/samuel-l-jackson/","https://letterboxd.com/actor/oscar-isaac/","https://letterboxd.com/actor/jacob-elordi/","https://letterboxd.com/actor/mia-goth/","https://letterboxd.com/actor/felix-kammerer/","https://letterboxd.com/actor/lea-seydoux/","https://letterboxd.com/actor/frances-mcdormand/","https://letterboxd.com/actor/ewan-mcgregor/","https://letterboxd.com/actor/david-bradley-1/","https://letterboxd.com/actor/gregory-mann/","https://letterboxd.com/actor/burn-gorman/","https://letterboxd.com/actor/ron-perlman/","https://letterboxd.com/actor/kurt-russell/","https://letterboxd.com/actor/zoe-bell/","https://letterboxd.com/actor/rosario-dawson/","https://letterboxd.com/actor/vanessa-ferlito/","https://letterboxd.com/actor/sydney-tamiia-poitier/","https://letterboxd.com/actor/jeff-goldblum/","https://letterboxd.com/actor/julianne-moore/","https://letterboxd.com/actor/peter-postlethwaite/","https://letterboxd.com/actor/arliss-howard/","https://letterboxd.com/actor/richard-attenborough/","https://letterboxd.com/actor/kyle-chandler/","https://letterboxd.com/actor/vera-farmiga/","https://letterboxd.com/actor/millie-bobby-brown/","https://letterboxd.com/actor/ken-watanabe/","https://letterboxd.com/actor/zhang-ziyi/","https://letterboxd.com/actor/jay-hernandez/","https://letterboxd.com/actor/derek-richardson/","https://letterboxd.com/actor/eythor-gudjonsson/","https://letterboxd.com/actor/barbara-nedeljakova/","https://letterboxd.com/actor/jana-kaderabkova/", "https://letterboxd.com/actor/charles-parnell/","https://letterboxd.com/actor/kerry-omalley/","https://letterboxd.com/actor/hugh-jackman/","https://letterboxd.com/actor/james-mcavoy/","https://letterboxd.com/actor/patrick-stewart/","https://letterboxd.com/actor/ian-mckellen/","https://letterboxd.com/actor/chiwetel-ejiofor/","https://letterboxd.com/actor/lupita-nyongo/","https://letterboxd.com/actor/benedict-cumberbatch/","https://letterboxd.com/actor/paul-dano/","https://letterboxd.com/actor/jennifer-lawrence/","https://letterboxd.com/actor/rose-byrne/","https://letterboxd.com/actor/kevin-bacon/","https://letterboxd.com/actor/contributor:17664/","https://letterboxd.com/actor/matthew-mcconaughey/","https://letterboxd.com/actor/ben-kingsley/","https://letterboxd.com/actor/max-von-sydow/","https://letterboxd.com/actor/america-ferrera/","https://letterboxd.com/actor/ariana-greenblatt/","https://letterboxd.com/actor/issa-rae/","https://letterboxd.com/actor/domhnall-gleeson/","https://letterboxd.com/actor/rachel-mcadams/","https://letterboxd.com/actor/bill-nighy/","https://letterboxd.com/actor/tom-hollander/","https://letterboxd.com/actor/diego-calva/","https://letterboxd.com/actor/jovan-adepo/","https://letterboxd.com/actor/jean-smart/","https://letterboxd.com/actor/marcia-gay-harden/","https://letterboxd.com/actor/william-hurt/","https://letterboxd.com/actor/jena-malone/","https://letterboxd.com/actor/brian-h-dierker/","https://letterboxd.com/actor/brian-cox-2/","https://letterboxd.com/actor/ophelia-lovibond/","https://letterboxd.com/actor/olwen-catherine-kelly/","https://letterboxd.com/actor/michael-mcelhatton/","https://letterboxd.com/actor/christina-ricci/","https://letterboxd.com/actor/john-goodman/","https://letterboxd.com/actor/matthew-fox/","https://letterboxd.com/actor/elisha-cuthbert/","https://letterboxd.com/actor/timothy-olyphant/","https://letterboxd.com/actor/christopher-marquette/","https://letterboxd.com/actor/demi-moore/","https://letterboxd.com/actor/dennis-quaid/","https://letterboxd.com/actor/edward-hamilton-clark/","https://letterboxd.com/actor/gore-abrams/","https://letterboxd.com/actor/emma-stone/","https://letterboxd.com/actor/ramy-youssef/","https://letterboxd.com/actor/christopher-abbott/","https://letterboxd.com/actor/russell-crowe/","https://letterboxd.com/actor/angourie-rice/","https://letterboxd.com/actor/matt-bomer/","https://letterboxd.com/actor/jesse-plemons/","https://letterboxd.com/actor/hong-chau/","https://letterboxd.com/actor/patrick-wilson/","https://letterboxd.com/actor/lili-taylor/","https://letterboxd.com/actor/ron-livingston/","https://letterboxd.com/actor/hayley-mcfarland/","https://letterboxd.com/actor/steve-carell/","https://letterboxd.com/actor/lio-tipton/","https://letterboxd.com/actor/will-ferrell/","https://letterboxd.com/actor/sofia-vergara/","https://letterboxd.com/actor/miranda-cosgrove/","https://letterboxd.com/actor/lily-rose-depp/","https://letterboxd.com/actor/nicholas-hoult/","https://letterboxd.com/actor/bill-skarsgard/","https://letterboxd.com/actor/john-david-washington/","https://letterboxd.com/actor/robert-pattinson/","https://letterboxd.com/actor/elizabeth-debicki/","https://letterboxd.com/actor/kenneth-branagh/","https://letterboxd.com/actor/dimple-kapadia/","https://letterboxd.com/actor/robert-redford/","https://letterboxd.com/actor/sebastian-stan/","https://letterboxd.com/actor/shameik-moore/","https://letterboxd.com/actor/jake-johnson-1/","https://letterboxd.com/actor/hailee-steinfeld/","https://letterboxd.com/actor/mahershala-ali/","https://letterboxd.com/actor/joaquin-phoenix/","https://letterboxd.com/actor/robert-de-niro/","https://letterboxd.com/actor/zazie-beetz/","https://letterboxd.com/actor/brett-cullen/","https://letterboxd.com/actor/luna-lauren-velez/","https://letterboxd.com/actor/gemma-chan/","https://letterboxd.com/actor/richard-madden/","https://letterboxd.com/actor/salma-hayek-pinault/","https://letterboxd.com/actor/kumail-nanjiani/","https://letterboxd.com/actor/vin-diesel/","https://letterboxd.com/actor/paul-walker/","https://letterboxd.com/actor/dwayne-johnson/","https://letterboxd.com/actor/jordana-brewster/","https://letterboxd.com/actor/michelle-rodriguez/","https://letterboxd.com/actor/jessica-rothe/","https://letterboxd.com/actor/h-jon-benjamin/","https://letterboxd.com/actor/michelle-dockery/","https://letterboxd.com/actor/brett-gelman/","https://letterboxd.com/actor/henry-golding/","https://letterboxd.com/actor/haruka-abe/","https://letterboxd.com/actor/ursula-corbero/","https://letterboxd.com/actor/samara-weaving/","https://letterboxd.com/actor/noah-centineo/","https://letterboxd.com/actor/callina-liang/", "https://letterboxd.com/actor/cody-rhodes-1/","https://letterboxd.com/actor/david-dastmalchian/","https://letterboxd.com/actor/anya-taylor-joy/","https://letterboxd.com/actor/janet-mcteer-1/","https://letterboxd.com/actor/paul-adelstein/","https://letterboxd.com/actor/stanley-tucci/","https://letterboxd.com/actor/john-lithgow/","https://letterboxd.com/actor/lucian-msamati/","https://letterboxd.com/actor/brendan-gleeson/","https://letterboxd.com/actor/al-pacino/","https://letterboxd.com/actor/steven-bauer/","https://letterboxd.com/actor/michelle-pfeiffer/","https://letterboxd.com/actor/mary-elizabeth-mastrantonio/","https://letterboxd.com/actor/robert-loggia/","https://letterboxd.com/actor/bryan-cranston/","https://letterboxd.com/actor/koyu-rankin/","https://letterboxd.com/actor/bob-balaban/","https://letterboxd.com/actor/bill-murray/","https://letterboxd.com/actor/mia-threapleton/","https://letterboxd.com/actor/riz-ahmed/","https://letterboxd.com/actor/tom-hulce/","https://letterboxd.com/actor/elizabeth-berridge/","https://letterboxd.com/actor/simon-callow/","https://letterboxd.com/actor/roy-dotrice/","https://letterboxd.com/actor/olivia-cooke/","https://letterboxd.com/actor/paul-raci/","https://letterboxd.com/actor/lauren-ridloff/","https://letterboxd.com/actor/kirsten-dunst/","https://letterboxd.com/actor/steve-coogan/","https://letterboxd.com/actor/judy-davis/","https://letterboxd.com/actor/rip-torn/","https://letterboxd.com/actor/george-clooney/","https://letterboxd.com/actor/meryl-streep/","https://letterboxd.com/actor/wallace-wolodarsky/","https://letterboxd.com/actor/eric-chase-anderson/","https://letterboxd.com/actor/thomas-kretschmann/","https://letterboxd.com/actor/frank-finlay/","https://letterboxd.com/actor/maureen-lipman/","https://letterboxd.com/actor/emilia-fox/","https://letterboxd.com/actor/zendaya/","https://letterboxd.com/actor/jacob-batalon/","https://letterboxd.com/actor/michael-shannon/","https://letterboxd.com/actor/josh-oconnor/","https://letterboxd.com/actor/glenn-close/","https://letterboxd.com/actor/mila-kunis/","https://letterboxd.com/actor/mark-hamill/","https://letterboxd.com/actor/carrie-fisher/","https://letterboxd.com/actor/adam-driver/","https://letterboxd.com/actor/daisy-ridley/","https://letterboxd.com/actor/eva-green/","https://letterboxd.com/actor/mads-mikkelsen/","https://letterboxd.com/actor/judi-dench/","https://letterboxd.com/actor/trevante-rhodes/","https://letterboxd.com/actor/andre-holland/","https://letterboxd.com/actor/ashton-sanders/","https://letterboxd.com/actor/jharrel-jerome/","https://letterboxd.com/actor/taraji-p-henson/","https://letterboxd.com/actor/octavia-spencer/","https://letterboxd.com/actor/kevin-costner/","https://letterboxd.com/actor/william/","https://letterboxd.com/actor/leslie-mann/","https://letterboxd.com/actor/cynthia-erivo/","https://letterboxd.com/actor/clarke-peters/","https://letterboxd.com/actor/vanessa-bell-calloway/","https://letterboxd.com/actor/kate-hudson/","https://letterboxd.com/actor/annie-parisse/","https://letterboxd.com/actor/adam-goldberg/","https://letterboxd.com/actor/cameron-diaz/","https://letterboxd.com/actor/kate-winslet/","https://letterboxd.com/actor/jude-law/","https://letterboxd.com/actor/eli-wallach/","https://letterboxd.com/actor/lin-manuel-miranda/","https://letterboxd.com/actor/renee-elise-goldsberry/","https://letterboxd.com/actor/phillipa-soo/","https://letterboxd.com/actor/daveed-diggs/","https://letterboxd.com/actor/tom-bateman-1/","https://letterboxd.com/actor/josh-gad/","https://letterboxd.com/actor/lidya-jewett/","https://letterboxd.com/actor/olivia-marcum/","https://letterboxd.com/actor/ann-dowd/","https://letterboxd.com/actor/jennifer-nettles/","https://letterboxd.com/actor/kingsley-ben-adir/","https://letterboxd.com/actor/eli-goree/","https://letterboxd.com/actor/aldis-hodge/","https://letterboxd.com/actor/joaquina-kalukango-1/","https://letterboxd.com/actor/mary-elizabeth-winstead/","https://letterboxd.com/actor/ellen-wong/","https://letterboxd.com/actor/kieran-culkin/","https://letterboxd.com/actor/alison-pill/","https://letterboxd.com/actor/tom-blyth/","https://letterboxd.com/actor/rachel-zegler/","https://letterboxd.com/actor/peter-dinklage/","https://letterboxd.com/actor/hunter-schafer/","https://letterboxd.com/actor/lynn-adrianna/","https://letterboxd.com/actor/lisa-renee-pitts/","https://letterboxd.com/actor/gabe-gomez/","https://letterboxd.com/actor/roman-griffin-davis/","https://letterboxd.com/actor/thomasin-mckenzie/","https://letterboxd.com/actor/taika-waititi/","https://letterboxd.com/actor/sam-rockwell/", "https://letterboxd.com/actor/gary-sinise/","https://letterboxd.com/actor/sally-field/","https://letterboxd.com/actor/mykelti-williamson/","https://letterboxd.com/actor/christopher-walken/","https://letterboxd.com/actor/martin-sheen/","https://letterboxd.com/actor/nathalie-baye/","https://letterboxd.com/actor/tim-allen/","https://letterboxd.com/actor/don-rickles/","https://letterboxd.com/actor/jim-varney/","https://letterboxd.com/actor/wallace-shawn/","https://letterboxd.com/actor/owen-wilson/","https://letterboxd.com/actor/paul-newman/","https://letterboxd.com/actor/bonnie-hunt/","https://letterboxd.com/actor/larry-the-cable-guy/","https://letterboxd.com/actor/cheech-marin/","https://letterboxd.com/actor/zoe-kravitz/","https://letterboxd.com/actor/colin-farrell/","https://letterboxd.com/actor/josh-hutcherson/","https://letterboxd.com/actor/liam-hemsworth/","https://letterboxd.com/actor/elizabeth-banks/","https://letterboxd.com/actor/lakeith-stanfield/","https://letterboxd.com/actor/julia-fox/","https://letterboxd.com/actor/kevin-garnett/","https://letterboxd.com/actor/idina-menzel/","https://letterboxd.com/actor/benedict-wong/","https://letterboxd.com/actor/jessica-chastain/","https://letterboxd.com/actor/casey-affleck/","https://letterboxd.com/actor/rebecca-ferguson/","https://letterboxd.com/actor/jason-momoa/","https://letterboxd.com/actor/stellan-skarsgard/","https://letterboxd.com/actor/javier-bardem/","https://letterboxd.com/actor/saoirse-ronan/","https://letterboxd.com/actor/laurie-metcalf/","https://letterboxd.com/actor/tracy-letts/","https://letterboxd.com/actor/lucas-hedges/","https://letterboxd.com/actor/florence-pugh/","https://letterboxd.com/actor/eliza-scanlen/","https://letterboxd.com/actor/laura-dern/","https://letterboxd.com/actor/renate-reinsve/","https://letterboxd.com/actor/inga-ibsdotter-lilleaas/","https://letterboxd.com/actor/anders-danielsen-lie/","https://letterboxd.com/actor/cate-blanchett/","https://letterboxd.com/actor/julia-ormond/","https://letterboxd.com/actor/jason-flemyng/","https://letterboxd.com/actor/sharlto-copley/","https://letterboxd.com/actor/lesley-manville/","https://letterboxd.com/actor/dimitrius-schuster-koloamatangi/","https://letterboxd.com/actor/ravi-narayan/","https://letterboxd.com/actor/michael-homick/","https://letterboxd.com/actor/stefan-grube/","https://letterboxd.com/actor/tom-cruise/","https://letterboxd.com/actor/val-kilmer/","https://letterboxd.com/actor/miles-teller/","https://letterboxd.com/actor/bashir-salahuddin/","https://letterboxd.com/actor/barry-keoghan/","https://letterboxd.com/actor/brian-darcy-james/","https://letterboxd.com/actor/hudson-mcguire/","https://letterboxd.com/actor/henry-glendon-walter-v/","https://letterboxd.com/actor/robert-levey-ii/","https://letterboxd.com/actor/andrew-garfield/","https://letterboxd.com/actor/yura-borisov/","https://letterboxd.com/actor/cooper-koch/","https://letterboxd.com/actor/cooper-hoffman/","https://letterboxd.com/actor/ben-affleck/","https://letterboxd.com/actor/rosamund-pike/","https://letterboxd.com/actor/neil-patrick-harris/","https://letterboxd.com/actor/tyler-perry/","https://letterboxd.com/actor/carrie-coon/","https://letterboxd.com/actor/emily-blunt/","https://letterboxd.com/actor/john-krasinski/","https://letterboxd.com/actor/millicent-simmonds/","https://letterboxd.com/actor/noah-jupe/","https://letterboxd.com/actor/cillian-murphy/","https://letterboxd.com/actor/robbie-coltrane/","https://letterboxd.com/actor/richard-harris/","https://letterboxd.com/actor/tom-felton/","https://letterboxd.com/actor/toby-jones/","https://letterboxd.com/actor/logan-lerman/","https://letterboxd.com/actor/ezra-miller/","https://letterboxd.com/actor/mae-whitman/","https://letterboxd.com/actor/kate-walsh/","https://letterboxd.com/actor/mia-wasikowska/","https://letterboxd.com/actor/crispin-glover/","https://letterboxd.com/actor/ben-whishaw/","https://letterboxd.com/actor/hugh-bonneville/","https://letterboxd.com/actor/sally-hawkins/","https://letterboxd.com/actor/madeleine-harris/","https://letterboxd.com/actor/samuel-joslin/","https://letterboxd.com/actor/dianne-wiest-1/","https://letterboxd.com/actor/anthony-michael-hall/","https://letterboxd.com/actor/kathy-baker/","https://letterboxd.com/actor/geoffrey-rush/","https://letterboxd.com/actor/orlando-bloom/","https://letterboxd.com/actor/keira-knightley/","https://letterboxd.com/actor/jack-davenport/","https://letterboxd.com/actor/freddie-highmore/","https://letterboxd.com/actor/david-kelly/","https://letterboxd.com/actor/noah-taylor/","https://letterboxd.com/actor/channing-tatum/","https://letterboxd.com/actor/brie-larson/", "https://letterboxd.com/actor/jason-bateman/","https://letterboxd.com/actor/charlize-theron/","https://letterboxd.com/actor/chris-pratt/","https://letterboxd.com/actor/zac-efron/","https://letterboxd.com/actor/don-cheadle/","https://letterboxd.com/actor/bradley-cooper/","https://letterboxd.com/actor/vincent-d-onofrio/","https://letterboxd.com/actor/gwyneth-paltrow/","https://letterboxd.com/actor/samuel-l-jackson/","https://letterboxd.com/actor/scarlett-johansson/","https://letterboxd.com/actor/tom-holland-4/","https://letterboxd.com/actor/benedict-cumberbatch/","https://letterboxd.com/actor/chris-hemsworth/", "https://letterboxd.com/actor/chris-evans/", "https://letterboxd.com/actor/josh-brolin/", "https://letterboxd.com/actor/tom-hardy/", "https://letterboxd.com/actor/joseph-gordon-levitt/", "https://letterboxd.com/actor/michael-keaton/", "https://letterboxd.com/actor/marisa-tomei/", "https://letterboxd.com/actor/jon-favreau/", "https://letterboxd.com/actor/lily-james/", "https://letterboxd.com/actor/jon-hamm/", "https://letterboxd.com/actor/jamie-foxx/", "https://letterboxd.com/actor/will-ferrell/", "https://letterboxd.com/actor/samuel-l-jackson/", "https://letterboxd.com/actor/emma-stone/", "https://letterboxd.com/actor/christopher-walken/", "https://letterboxd.com/actor/russell-crowe/", "https://letterboxd.com/actor/hong-chau/", "https://letterboxd.com/actor/patrick-wilson/", "https://letterboxd.com/actor/lili-taylor/", "https://letterboxd.com/actor/hayley-mcfarland/", "https://letterboxd.com/actor/timothy-olyphant/"];
let running = false;
let uhhhhh = false;
let music = false;
let path = [];
const display = document.getElementById("display");

function fixInput(input) {
  console.log(input);
  inputArray = input.split("/");
  console.log(inputArray);
  inputArray.pop();
  inputArray.pop();
  input = inputArray.join("/") + "/";
  console.log(input);
  return input;
}



chrome.runtime.onMessage.addListener(async (message) => {           // listener for receiving info from navigating letterboxd pages

  if (message.type === "popularMovies") {
    console.log("Received popular movies:", message.payload);

    movies = message.payload;
  }
  if (message.type !== "letterboxdData") {
    return;
  }
  if (uhhhhh && running) {
    playSound('sounds/vine_boom.mp3');      // whenever a run starts 2 messages are sent and
  }                                         // i dont want 2 vine booms so idk just dont play the first one
  uhhhhh = true;
  
  if (running) {
    if (message.payload.url === goalInput.value) {    // win condition
      path.push(message.payload.item);

      await stop();
      let minutes = Math.floor(difference / 60000);
      let seconds = Math.floor((difference % 60000) / 1000);
      let milliseconds = Math.floor(difference % 1000);
      // Format time to ensure leading zeros
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      milliseconds = milliseconds < 100 ? milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds : milliseconds;
      
      document.getElementById("minutes").textContent = minutes;
      document.getElementById("seconds").textContent = seconds;
      document.getElementById("milliseconds").textContent = milliseconds;


      searchBlock.style.display = "none";
      startBtns.style.display = "none";
      exitDiv.style.display = "none";
      returnBtn.style.display = "block";
      endBtns.style.display = "block";
      playSound('sounds/fnaf.mp3');
      playSound('sounds/happy_wheels.mp3');


      let { wins = 0 } = await chrome.storage.local.get("wins");          // stats calculations
      await wins++; 
      await chrome.storage.local.set( {wins} );


      let { winStreak = 0 } = await chrome.storage.local.get("winStreak");
      await winStreak++;
      await chrome.storage.local.set( {winStreak} );


      let { shortestPathLength = Infinity } = await chrome.storage.local.get("shortestPathLength");
      if (path.length < shortestPathLength) {
        shortestPathLength = path.length;
        await chrome.storage.local.set( {shortestPathLength} );
      }


      let { avgPathLength = 0 } = await chrome.storage.local.get("avgPathLength");
      avgPathLength = ((avgPathLength * (wins - 1)) + path.length) / wins;
      await chrome.storage.local.set( {avgPathLength} );


      let { longestPathLength = 0 } = await chrome.storage.local.get("longestPathLength");
      if (path.length > longestPathLength) {
        longestPathLength = path.length;
        await chrome.storage.local.set( {longestPathLength} );
      }
      

      let { shortestTime = Infinity } = await chrome.storage.local.get("shortestTime");
      if (difference < shortestTime) {
        shortestTime = difference;
        await chrome.storage.local.set( {shortestTime} );
      }
      

      let { avgTime = 0 } = await chrome.storage.local.get("avgTime");
      avgTime = ((avgTime * (wins - 1)) + difference) / wins;
      await chrome.storage.local.set( {avgTime} );


      let { longestTime = 0 } = await chrome.storage.local.get("longestTime");
      if (difference > longestTime) {
        longestTime = difference;
        await chrome.storage.local.set( {longestTime} );
      }

      let { mostVisited = {} } = await chrome.storage.local.get("mostVisited");
      path.forEach(item => {
        if (mostVisited[item]) {
          //console.log("revisited page");
          mostVisited[item]++;
        }
        else {
          mostVisited[item] = 1;
        }
        
        console.log(mostVisited);
      });
      await chrome.storage.local.set( {mostVisited} );

    }
    else {
      item = message.payload.item;
      if (path.includes(item)) {
        index = path.findIndex(x => x === item);
        path = path.slice(0, index)
      }
      path.push(item);
    }

    pathList = path.join(" => ");
    document.getElementById("path").innerText = `${pathList}`;
  }
  else {
    path = [];
  }
});



startRunBtn.addEventListener("click", async () => {         // listener for initializing the run on button click
  if (goalInput.value && startInput.value) {
    if (goalInput.value.split("/").length > 6) {
      goalInput.value = fixInput(goalInput.value);
    }
    if (startInput.value.split("/").length > 6) {
      startInput.value = fixInput(startInput.value);
    }
    
    await startRun(goalInput.value, startInput.value);
    
  }
});

randomBtn.addEventListener("click", async () => {         // listener for random goal button
  // make a startRun function that basically does what the startRunBtn event listener does, passing in a goal url
  // need functionality to go to the url of a random movie and display the url of the goal
  // console.log("Random button clicked");

  dicePng.style.display = "none";
  randomText.style = "display: block; padding: 16px; font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 35px; height: 70px; position: relative; margin-top: 2px; bottom: 7px;";

  const tabs = await chrome.tabs.query({ url: "https://letterboxd.com/*" });

  tab = tabs[0];

  await chrome.scripting.executeScript({    
    target: { tabId: tab.id },              
    files: ["content.js"],
  });

  chrome.tabs.sendMessage(tab.id, { type: "randomPress" });

  if (Object.keys(movies).length === 0) {
    while (Object.keys(movies).length === 0) {
      console.log("Waiting for movies to be populated...");
      await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
    }
  }

  let startURL;
  let goalURL;
  
  if (Math.random() < 0.5) {
    startURL = movies[Math.floor(Math.random() * Object.keys(movies).length)].url;

    if (Math.random() < 0.5) {
      goalURL = movies[Math.floor(Math.random() * Object.keys(movies).length)].url;

      while (goalURL === startURL) {
        goalURL = movies[Math.floor(Math.random() * Object.keys(movies).length)].url;
      }
    }
    else {
      goalURL = actors[Math.floor(Math.random() * actors.length)];

      while (goalURL === startURL) {
        goalURL = actors[Math.floor(Math.random() * actors.length)];
      }
    }

    chrome.tabs.sendMessage(tab.id, { type: "navigateToUrl", payload: startURL});


  }
  else {
    startURL = actors[Math.floor(Math.random() * actors.length)];

    if (Math.random() < 0.5) {
      goalURL = movies[Math.floor(Math.random() * Object.keys(movies).length)].url;

      while (goalURL === startURL) {
        goalURL = movies[Math.floor(Math.random() * Object.keys(movies).length)].url;
      }
    }
    else {
      goalURL = actors[Math.floor(Math.random() * actors.length)];

      while (goalURL === startURL) {
        goalURL = actors[Math.floor(Math.random() * actors.length)];
      }
    }

    chrome.tabs.sendMessage(tab.id, { type: "navigateToUrl", payload: startURL});
  }


  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
    if (tabId === tab.id && info.status === "complete") {
      chrome.tabs.onUpdated.removeListener(listener);
      startInput.value = startURL;
      goalInput.value = goalURL;
      startRun(goalInput.value, startInput.value);
    }
  });
});

randomStart.addEventListener("click", async () => {
  //console.log("random start button clicked");
  startInput.value = await fillRandom();
});

randomGoal.addEventListener("click", async () => {
  goalInput.value = await fillRandom();
});

async function fillRandom() {
  if (Object.keys(movies).length === 0) {
    const tabs = await chrome.tabs.query({ url: "https://letterboxd.com/*" });

    tab = tabs[0];

    await chrome.scripting.executeScript({    
      target: { tabId: tab.id },              
      files: ["content.js"],
    });

    chrome.tabs.sendMessage(tab.id, { type: "randomPress" });

    while (Object.keys(movies).length === 0) {
      console.log("Waiting for movies to be populated...");
      await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
    }
  }

  if (Math.random() < 0.5) {
    return movies[Math.floor(Math.random() * Object.keys(movies).length)].url;
  }
  else {
    return actors[Math.floor(Math.random() * actors.length)];
  }
}

statsBtn.addEventListener("click", async () => {         // listener for stats button
  searchBlock.style.display = "none";
  startBtns.style.display = "none";
  exitDiv.style.display = "none";
  stopwatch.style.display = "none";

  statsDisplay.style.display = "block";
  statsBtns.style.display = "block";

  data = await chrome.storage.local.get(null);

  document.getElementById("winsNum").textContent = data.wins || 0;
  document.getElementById("winStreakNum").textContent = data.winStreak || 0;
  document.getElementById("shortestPathLengthNum").textContent = data.shortestPathLength || "N/A";
  document.getElementById("avgPathLengthNum").textContent = data.avgPathLength ? data.avgPathLength.toFixed(2) : "N/A";
  document.getElementById("longestPathLengthNum").textContent = data.longestPathLength || "N/A";
  document.getElementById("shortestTimeNum").textContent = data.shortestTime ? (data.shortestTime / 1000).toFixed(2) + "s" : "N/A";
  document.getElementById("avgTimeNum").textContent = data.avgTime ? (data.avgTime / 1000).toFixed(2) + "s" : "N/A";
  document.getElementById("longestTimeNum").textContent = data.longestTime ? (data.longestTime / 1000).toFixed(2) + "s" : "N/A";
  console.log("wins: ", data.wins);
  console.log("win streak: ", data.winStreak);
  console.log("shortest length: ", data.shortestPathLength);
  console.log("average length: ", data.avgPathLength);
  console.log("longest length:", data.longestPathLength);
  console.log("shortest time:", data.shortestTime);
  console.log("average time:", data.avgTime);
  console.log("longest time:", data.longestTime);
  console.log("most visited: \n", data.mostVisited);
  // finish for times and then probably make displays for those and then work on graph

  

  // dynamically create side by side vertical green bars for top 10 most visited pages with the counts on top, or substituting for 0 and "---" if undefined data
  statsBars.innerHTML = ""; // Clear previous bars
  statsBarsNums.innerHTML = "";
  statsBarsItems.innerHTML = "";

  let entries = [];
  

  if (data.mostVisited) {
    entries = Object.entries(data.mostVisited);
    entries.sort(([, a], [, b]) => b - a);
  }

  let item;
  let num;
  let highest = 0;

  for (let i = 0; i < 10; i++) {
    if (entries[i]) {
      // cut off item length to 20 characters with a ... at the end if longer
      item = entries[i][0];
      item = item.length > 19 ? item.slice(0, 16) + "..." : item;
      num = entries[i][1];
      highest = entries[0][1];
    }
    else {
      item = "---";
      num = 0;
    }
    
    //console.log(item);

    const barNum = document.createElement("div");
    barNum.className = "flex-child bar-num";
    barNum.style.width = "20px";
    barNum.style.marginRight = "16px";
    barNum.style.textAlign = "center";
    barNum.style.position = "relative";
    barNum.style.bottom = "-10px";
    barNum.innerText = num;

    const bar = document.createElement("div");
    bar.className = "flex-child bar";
    bar.style.width = "20px";
    if (num === 0) {
      bar.style.height = "2%";
    }
    else {
      bar.style.height = `${num / highest * 100}%`;
    }
    bar.style.marginRight = "16px";
    bar.style.textAlign = "center";
    bar.style.backgroundColor = "#00E054";

    const barItem = document.createElement("div");
    barItem.className = "flex-child rotate bar-item";
    barItem.style.width = "20px";
    barItem.style.marginRight = "16px";
    barItem.style.textAlign = "left";
    barItem.style.position = "relative";
    barItem.style.top = "-20px";
    barItem.innerText = item;

    



    statsBarsNums.appendChild(barNum);
    statsBars.appendChild(bar);
    statsBarsItems.appendChild(barItem);
  }

  

  // const { paths = [] } = await chrome.storage.local.get("paths");
  // let wins = 67
  // await chrome.storage.local.set({ wins });
  // console.log(await chrome.storage.local.get("wins"));
  
  await labelSpacing();
  await loadSavedRuns();
});

function labelSpacing() {
  labels = document.getElementById("stats-bars-items").children;
  console.log(labels)
  const data = Array.from(labels).map(element => element.innerText);
  console.log(data);
  const items = data.map(item => item.toString());

  const longestLength = Math.max(
    ...items.map(str => str.length)
  );

  console.log("Longest label length:", longestLength);

  const charWidth = 7.5;          // px, for ~12pt font
  const angleRad = 60 * Math.PI / 180;

  const paddingBottom =
    Math.ceil(longestLength * charWidth * Math.sin(angleRad)) - 40;

  statsBarsItems.style.paddingBottom = `${paddingBottom}px`;
}

      
async function loadSavedRuns() {
  document.getElementById("saved-runs-list").innerHTML = "";
  data = await chrome.storage.local.get("paths");
  if (!data.paths) {
    data.paths = [];
  }
  for (let i = 0; i < data.paths.length; i++) {

    const statsEntry = document.createElement("div");
    const timeEntry = document.createElement("span");
    statsEntry.style.border = "3px solid #444C56";
    statsEntry.style.padding = "6px 10px 12px";
    statsEntry.style.marginTop = "10px";
    statsEntry.style.fontFamily = "'Graphik', sans-serif";
    statsEntry.style.fontSize = "14px";
    statsEntry.style.color = "#99AABB";

    let minutes = Math.floor(data.paths[data.paths.length - 1 - i].time / 60000);
    let seconds = Math.floor((data.paths[data.paths.length - 1 - i].time % 60000) / 1000);
    let milliseconds = Math.floor(data.paths[data.paths.length - 1 - i].time % 1000);
    // Format time to ensure leading zeros
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 100 ? milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds : milliseconds;

    timeEntry.innerHTML = `<b><span class="flex-child" style="font-size: 26px; width: 30%;">
                                <span id="stats-minutes" style="color: #FF8000">${minutes}</span>:<span id="stats-seconds" style="color: #00E054">${seconds}</span>.<span id="stats-milliseconds" style="color: #40BCF4">${milliseconds}</span></span></b>
                              <span class="flex-child" style="width: 30%;">
                                <button class="primary-orange delete-run" style="width: 32px; position: relative; right: -240px;"
                                run-index="${i}"><img src="images/trash.png" style="width: 24px; height: 24px; position: relative; right: 2.2px; top: 1px;"></button>
                              </span>`;
    statsEntry.appendChild(timeEntry);

    const pathEntry = document.createElement("div");
    pathEntry.textContent = `${data.paths[data.paths.length - 1 - i].path.join(" => ")}`;
    statsEntry.appendChild(pathEntry);

    document.getElementById("saved-runs-list").appendChild(statsEntry);
  }
}

function deleteRun(index) {
  data.paths.splice(data.paths.length - 1 - index, 1);
  chrome.storage.local.set({ paths: data.paths });
  console.log(data.paths);
}


document.addEventListener("click", async e => {
  if (!e.target.classList.contains("delete-run")) return;

  console.log("Delete button clicked");

  const index = parseInt(e.target.getAttribute("run-index"), 10);
  deleteRun(index);

  console.log(`Deleted run at index: ${index}`);

  await loadSavedRuns();
});

exitBtn.addEventListener("click", async () => {         // listener for exiting the run
  stop();
  // let { winStreak = 0 } = await chrome.storage.local.get("win-streak");
  let winStreak = 0;
  await chrome.storage.local.set( {winStreak} );
  returnToMenu();
});

returnBtn.addEventListener("click", async () => {         // listener for restarting on return button click
  returnToMenu();
});

statsReturnBtn.addEventListener("click", async () => {         // listener for returning from stats display
  returnToMenu();
});

clearStatsBtn.addEventListener("click", async () => {         // listener for clearing stats
  await chrome.storage.local.clear();

  document.getElementById("winsNum").textContent = 0;
  document.getElementById("winStreakNum").textContent = 0;
  document.getElementById("shortestPathLengthNum").textContent = "N/A";
  document.getElementById("avgPathLengthNum").textContent = "N/A";
  document.getElementById("longestPathLengthNum").textContent = "N/A";
  document.getElementById("shortestTimeNum").textContent = "N/A";
  document.getElementById("avgTimeNum").textContent = "N/A";
  document.getElementById("longestTimeNum").textContent = "N/A";

  Array.from(document.getElementsByClassName("bar-num")).forEach(element => {
    element.innerHTML = "0";
  });
  Array.from(document.getElementsByClassName("bar")).forEach(element => {
    element.style.height = "2%";
  });
  Array.from(document.getElementsByClassName("bar-item")).forEach(element => {
    element.innerHTML = "---";
  });
  labelSpacing();

  document.getElementById("saved-runs-list").innerHTML = "";
});

saveBtn.addEventListener("click", async () => {         // listener for saving run path
  saveBtn.textContent = "Saved!";

  try {
    const { paths = [] } = await chrome.storage.local.get("paths");

    const id = paths.length;

    paths.push({ path, time:difference });

    await chrome.storage.local.set({ paths });
    // console.log(paths);
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
  
});

function returnToMenu() {
  // randomBtn.innerHTML = randomHTML;
  // randomBtn.style = randomStyle;
  
  dicePng.style.display = "block";
  searchBlock.style.display = "block";
  startBtns.style.display = "block";
  stopwatch.style.display = "block";
  randomText.style.display = "none";
  returnBtn.style.display = "none";
  exitDiv.style.display = "none";
  runDisplay.style.display = "none";
  endBtns.style.display = "none";
  statsDisplay.style.display = "none";
  statsBtns.style.display = "none";
  saveBtn.textContent = "Save";
  document.getElementById("minutes").textContent = "00";
  document.getElementById("seconds").textContent = "00";
  document.getElementById("milliseconds").textContent = "000";
  difference = 0;
  path = [];
}

function getMovieOrCrewName(input) {
  const doc = new DOMParser().parseFromString(
    input,
    "text/html"
  );

  if (input.match("letterboxd.com/film")) {
      return (doc.querySelector("meta[property='og:title']").content);
  }
  else {
      let h1 = doc.querySelector("div[class='contextual-title']");
      let span = h1.querySelector("span[class='context']");
      return h1.textContent.replace(span.textContent, "").trim();
  }
}

function getDirectorAndCast(input) {
  const doc = new DOMParser().parseFromString(
    input,
    "text/html"
  );

  directorHTML = doc.querySelectorAll("span[class='prettify']");
  const directors = [...directorHTML].map(el => el.textContent);
  console.log(directors);

  castHTML = doc.querySelectorAll('div.cast-list.text-sluglist p a');
  const actors = [...castHTML].slice(0, 3).map(el => el.textContent);
  console.log(actors);

  return { directors, actors };
}

function getMoviesFromCrew(input) {
  const doc = new DOMParser().parseFromString(
    input,
    "text/html"
  );

  topMoviesHTML = doc.querySelectorAll('li.tooltip.griditem div.react-component');
  const topMovies = [...topMoviesHTML].slice(0, 5).map(el => el.getAttribute("data-item-name")); 
  console.log(topMovies);  

  return topMovies;
}

async function startRun(goalInputValue, startInputValue) {
  let uhhhhhhh = false;
  let directors, actors, goalName, topMovies = [];
  path = [];

  // get all recent letterboxd tabs
  const tabs = await chrome.tabs.query({ url: "https://letterboxd.com/*" });

  
  tab = tabs[0]; // pick the first Letterboxd tab aka the most recent one aka the one the user is on

  if (startInputValue != tabs[0].url) {
    uhhhhhhh = true;
    chrome.tabs.sendMessage(tab.id, { type: "navigateToUrl", payload: startInputValue});
  }

  // console.log("Goal URL before fetching HTML:", goalInputValue);
  let response = await chrome.runtime.sendMessage({ type: "requestTargetHTML", payload: goalInputValue });
  let goalHTML = response["html"];
  let isFilmPage = response["isFilmPage"];



  goalName = getMovieOrCrewName(goalHTML);
  if (isFilmPage) {
    // grab director names and three first actors
    let response = getDirectorAndCast(goalHTML); 
    // console.log(response.directors, response.actors);
    directors = response["directors"];
    actors = response["actors"];

    if (directors.length === 0) {
      directors = ["N/A"];
    }
    if (actors.length === 0) {
      actors = ["N/A"];
    }
  }
  else {
    // grab three first films
    topMovies = getMoviesFromCrew(goalHTML);
    if (topMovies.length === 0) {
      topMovies = ["N/A"];
    }
  }

  
  




  await chrome.scripting.executeScript({    // pretty much refreshes the content script otherwise it's 'out of date' after the
    target: { tabId: tab.id },              // extension is refreshed and theres nothing to catch the message to refresh
    files: ["content.js"]
  });

  // Send a message to the content script running in that tab
  if (!uhhhhhhh) {
    chrome.tabs.sendMessage(tab.id, { type: "refresh" });
  }
  // hide goal text and box, display pertinent info and path
  searchBlock.style.display = "none";
  runDisplay.style.display = "block";
  // runDisplay.querySelector("label[for='goal']").innerHTML = `<b><br><div style="font-size: large; font-family: 'Graphik', sans-serif; font-weight: 600;">Target: </div></b><div style="font-size: small; font-family: 'Graphik', sans-serif; font-weight: 400; color: #99AABB;">${goalName}</div>`;
  
  if (isFilmPage) {
    document.getElementById("target").innerHTML = `
    <div style="display: flex; margin-top: 10px; align-items: stretch;">
      <div class="flex-child" style="border: 3px solid #444C56; width: 55%; padding: 10px; font-size: 30px; color: #00E054;">
        ${goalName}
      </div>
      <div class="flex-child" style="position: relative; width: 30%; margin-left: 10px; font-size: 20px; gap: 10px; display: flex; flex-direction: column; justify-content: space-between;">
        <div class="" style="border: 3px solid #444C56; width: 100%; padding: 10px; font-size: 12px;"><span style="color: #40BCF4; font-size: 16px;">${directors.join(', ')}</span><br>DIRECTOR(S)</div>
        <div class="" style="border: 3px solid #444C56; width: 100%; padding: 10px; font-size: 12px;"><span style="color: #FF8000; font-size: 16px;">${actors.join('<div style="height: 8px;"></div>')}</span><br>STARRING</div>
      </div>
    </div><br>`;
  }
  else {
    document.getElementById("target").innerHTML = `
    <div style="display: flex; margin-top: 10px; align-items: stretch;">
      <div class="flex-child" style="border: 3px solid #444C56; width: 35%; padding: 10px; font-size: 30px; color: #00E054;">
        ${goalName}
      </div>
      <div class="flex-child" style="border: 3px solid #444C56; padding: 10px; margin-left: 10px; width: 50%; font-size: 12px;">
        <span style="color: #40BCF4; font-size: 16px;">${topMovies.join('<div style="height: 8px;"></div>')}</span><br>TOP MOVIES
      </div>
    </div><br>`;
  }



  // hide start run button, display exit button
  startBtns.style.display = "none";
  exitDiv.style.display = "block";

  // start stopwatch
  start();
  if (!music) {
    backgroundMusic('sounds/balatro.mp3');
    music = true
  }
}


// stopwatch stuff thanks google ai

async function start() {
  // Start the stopwatch
  startTime = Date.now() - difference;
  tInterval = setInterval(updateDisplay, 10); // Update every 10ms for precision
  running = true;
}

async function stop() {
  // Stop the stopwatch
  clearInterval(tInterval);
  running = false;
  difference = Date.now() - startTime; // Save elapsed time
}

function reset() {
    // Stop the timer, reset values, and update display to zero
    clearInterval(tInterval);
    running = false;
    difference = 0;
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    document.getElementById("milliseconds").textContent = "000";
}

function updateDisplay() {
    updatedTime = new Date(Date.now() - startTime);

    let minutes = updatedTime.getUTCMinutes();
    let seconds = updatedTime.getUTCSeconds();
    let milliseconds = updatedTime.getUTCMilliseconds();
    // Format time to ensure leading zeros
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 100 ? milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds : milliseconds;

    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
    document.getElementById("milliseconds").textContent = milliseconds;
}


const audioContext = new (window.AudioContext || window.webkitAudioContext)();      // sound effects

async function getBuffer(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

async function playSound(url, volume = 0.1) {
  if (audioContext.state === 'suspended') {
    await audioContext.resume(); // unlock audio on user interaction
  }

  const soundBuffer = await getBuffer(url);
  const source = audioContext.createBufferSource();
  source.buffer = soundBuffer;

  // Create a gain node to control volume
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume; // 0 = silent, 1 = full volume

   source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.start(0); // Play immediately
}


async function backgroundMusic(url, volume = 0.10) {
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const buffer = await getBuffer(url);

  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  source.buffer = buffer;
  source.loop = true;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);  

  currentSource = source;
  source.start();
}


githubLink.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://github.com/RoastedPotato05" });
});

githubLink.addEventListener("mouseover", () => {
  githubLink.style.cursor = "pointer";
});

letterboxdLink.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://letterboxd.com/RoastedPotato05/" });
});

letterboxdLink.addEventListener("mouseover", () => {
  letterboxdLink.style.cursor = "pointer";
});

stopwatch.addEventListener("mouseover", () => {
  stopwatch.style.cursor = "default";
});