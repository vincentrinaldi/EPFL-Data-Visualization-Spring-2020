//Standard initialization function
function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}

//Launch-time runner
whenDocumentLoaded(() => {
    data_loader("data/final_results.csv");
});

let results;

/* Load data to local*/
const data_loader= function(path){
    d3.csv(path).then(function(data) {
        //Assigning the loaded data to the local database
        results=data;
        //Filling the first flags
        assign_stats();
    });
};

/* Data processing functions*/
const get_data = function(from, to){
    let data = [];
    results.forEach(row => {
        let year = parseInt(row.date.substring(0,4), 10);
        if(year>=from && year<to) {
            data.push(row)
        }
    });
    return data;
}

const get_teams = function(data_i){
    let teams = new Set();
    data_i.forEach(row => {
        teams.add(row.away_team);
        teams.add(row.home_team);
    });
    return teams;
}

const init_array = function(unique_teams){
    let init_dict = [];
    unique_teams.forEach(team => init_dict[team] = 0);
    return init_dict;
}

const max_key_from_value= function(array, teams, at_least_10, team_to_match_played){
    let key_max = teams.values().next().value;
    let value_max = parseInt(array[key_max]);
    teams.forEach(team => {
        let value = array[team]
        if(at_least_10) {
            if(value>value_max && team_to_match_played[team]>=10) {
                value_max = value;
                key_max = team;
            }
        } else {
            if(value>value_max) {
                value_max = value;
                key_max = team;
            }
        }
    })
    return key_max;
}

const assign_stats= function(){
    const dates = [1872, 1900, 1930, 1950, 1970, 1990, 2000, 2010, 2020];
    const nameDivs = ["stat1", "stat2", "stat3", "stat4", "stat5", "stat6", "stat7", "stat8"];

    for (let i = 0; i < dates.length-1; i++) {
        const from = dates[i];
        const to = dates[i+1];
        const nameDiv = nameDivs[i];

        const shift = to-from;
        const data_ = get_data(from, to);
        const MATCH_PLAYED = data_.length;
        const MATCH_PLAYED_b = Number((data_.length/shift).toFixed(2));

        let GOALS_SCORED = 0;
        const unique_teams = get_teams(data_);
        let team_to_match_played = init_array(unique_teams);
        let team_to_goal_scored = init_array(unique_teams);
        let team_to_average_score = init_array(unique_teams);
        let team_to_wins = init_array(unique_teams);
        let team_to_wins_ratio = init_array(unique_teams);
        let team_to_drawns = init_array(unique_teams);
        let team_to_drawns_ratio = init_array(unique_teams);
        let team_to_defeats = init_array(unique_teams);
        let team_to_defeats_ratio = init_array(unique_teams);

        data_.forEach(row => {
            GOALS_SCORED+=parseInt(row.away_score);
            GOALS_SCORED+=parseInt(row.home_score);
            team_to_match_played[row.away_team]+=1;
            team_to_match_played[row.home_team]+=1;
            team_to_goal_scored[row.away_team]+=parseInt(row.away_score);
            team_to_goal_scored[row.home_team]+=parseInt(row.home_score);
            if(row.home_score>row.away_score) team_to_wins[row.home_team]+=1;
            if(row.away_score>row.home_score) team_to_wins[row.away_team]+=1;
            if(row.home_score===row.away_score){
                team_to_drawns[row.home_team]+=1;
                team_to_drawns[row.away_team]+=1;
            }
            if(row.home_score<row.away_score) team_to_defeats[row.home_team]+=1;
            if(row.away_score<row.home_score) team_to_defeats[row.away_team]+=1;
        });

        unique_teams.forEach(team => {
            team_to_average_score[team] = team_to_goal_scored[team]/team_to_match_played[team];
            team_to_wins_ratio[team] = team_to_wins[team]/team_to_match_played[team];
            team_to_drawns_ratio[team] = team_to_drawns[team]/team_to_match_played[team];
            team_to_defeats_ratio[team] = team_to_defeats[team]/team_to_match_played[team];
        });

        const TEAMS_INVOLVED = unique_teams.size;
        const MOST_INVOLVED_TEAM = max_key_from_value(team_to_match_played, unique_teams, false, team_to_match_played);
        const MOST_INVOLVED_TEAM_b = team_to_match_played[MOST_INVOLVED_TEAM];
        const MOST_INVOLVED_TEAM_c = Number((MOST_INVOLVED_TEAM_b/shift).toFixed(2));
        const GOALS_SCORED_b = Number((GOALS_SCORED/shift).toFixed(2));
        const GOALS_SCORED_c = Number((GOALS_SCORED/MATCH_PLAYED).toFixed(2));
        const MOST_SCORING_TEAM = max_key_from_value(team_to_goal_scored, unique_teams, false, team_to_match_played);
        const MOST_SCORING_TEAM_b = team_to_goal_scored[MOST_SCORING_TEAM];
        const MOST_SCORING_TEAM_c = Number((MOST_SCORING_TEAM_b/shift).toFixed(2));
        const HIGHEST_AVERAGE_SCORING_TEAM = max_key_from_value(team_to_average_score, unique_teams, true, team_to_match_played);
        const HIGHEST_AVERAGE_SCORING_TEAM_b = Number((team_to_average_score[HIGHEST_AVERAGE_SCORING_TEAM]).toFixed(2));
        const MOST_SUCCESFULL_TEAM = max_key_from_value(team_to_wins, unique_teams, false, team_to_match_played);
        const MOST_SUCCESFULL_TEAM_b = team_to_wins[MOST_SUCCESFULL_TEAM];
        const DRAWN_TEAM = max_key_from_value(team_to_drawns, unique_teams, false, team_to_match_played);
        const DRAWN_TEAM_b = team_to_drawns[DRAWN_TEAM];
        const WORST_LOSING_TEAM = max_key_from_value(team_to_defeats, unique_teams, false, team_to_match_played);
        const WORST_LOSING_TEAM_b = team_to_defeats[WORST_LOSING_TEAM];
        const MOST_SUCCESFULL_TEAM_RATIO = max_key_from_value(team_to_wins_ratio, unique_teams, true, team_to_match_played);
        const MOST_SUCCESFULL_TEAM_RATIO_b = Number((team_to_wins_ratio[MOST_SUCCESFULL_TEAM_RATIO]*100).toFixed(2));
        const DRAWN_TEAM_RATIO = max_key_from_value(team_to_drawns_ratio, unique_teams, true, team_to_match_played);
        const DRAWN_TEAM_RATIO_b = Number((team_to_drawns_ratio[DRAWN_TEAM_RATIO]*100).toFixed());
        const WORST_LOSING_TEAM_RATIO = max_key_from_value(team_to_defeats_ratio, unique_teams, true, team_to_match_played);
        const WORST_LOSING_TEAM_RATIO_b = Number((team_to_defeats_ratio[WORST_LOSING_TEAM_RATIO]*100).toFixed(2));


        const stat_section = document.getElementById(nameDiv);
        stat_section.classList.add("stats");
        const text = [
            '<b>Teams involved</b>:<em> - - - - - - - - - - - - - - - </em>'+TEAMS_INVOLVED+ ' teams',
            '<b>Matches played</b>:<em> - - - - - - - - - - - - - - -</em>'+MATCH_PLAYED+' matches  -  '+MATCH_PLAYED_b+' matches/year',
            '<b>Most involved team:</b><em> - - - - - - - - - - -</em> '+MOST_INVOLVED_TEAM+'  -  '+MOST_INVOLVED_TEAM_b+' matches  -  '+MOST_INVOLVED_TEAM_c+' matches/year',
            '<b>Goals scored</b>:<em> - - - - - - - - - - - - - - - - - .</em>'+GOALS_SCORED+' goals  -  '+GOALS_SCORED_b+' goals/year  -  '+GOALS_SCORED_c+' goals/match',
            '<b>Most scoring team</b>: <em> - - - - - - - - - - - - </em>'+MOST_SCORING_TEAM+'  -  '+MOST_SCORING_TEAM_b+' goals  -  '+MOST_SCORING_TEAM_c+' goals/year',
            '<b>Highest average scoring team</b>*: <em>.</em>'+HIGHEST_AVERAGE_SCORING_TEAM+'  -  '+HIGHEST_AVERAGE_SCORING_TEAM_b+' goals/match',
            '<b>Most successful team</b>: <em> - - - - - - - - - </em>'+MOST_SUCCESFULL_TEAM+'  -  '+MOST_SUCCESFULL_TEAM_b+' wins',
            '<b>Best win ratio</b>*:  <em> - - - - - - - - - - - - - - - - </em>'+MOST_SUCCESFULL_TEAM_RATIO+'  -  '+MOST_SUCCESFULL_TEAM_RATIO_b+'%',
            '<b>Drawn team</b>: <em> - - - - - - - - - - - - - - .- - - - </em>'+DRAWN_TEAM+'  -  '+DRAWN_TEAM_b+' drawns',
            '<b>Best drawn ratio</b>*: <em> - - - - - - - - - .- - - - </em>'+DRAWN_TEAM_RATIO+'  -  '+DRAWN_TEAM_RATIO_b+'%',
            '<b>Worst losing team</b>: <em> - - - - - - - - - - - -- </em>'+WORST_LOSING_TEAM+'  -  '+WORST_LOSING_TEAM_b+' defeats',
            '<b>Best defeat ratio</b>*: <em> - - - - - - - - - - - - - </em>'+WORST_LOSING_TEAM_RATIO+'  -  '+WORST_LOSING_TEAM_RATIO_b+'%'
        ];
        text.forEach(t => {
            const p = document.createElement("p");
            p.innerHTML = t;
            stat_section.appendChild(p);
        });
        const elem = document.createElement("small");
        elem.innerHTML = '<br>* only teams involved in more than 10 matches are considered';

        stat_section.appendChild(elem);
    }

}

/* Tab change function */
const change_tab= function(name) {
    //Changing the backgrounds and titles depending on the tab
    if (name === 'VISUALIZATION from history') {
        window.open("Website/visualizations/index_visu.html",'_self');
    }
    else if (name === 'VISUALIZATION from other') {
        window.open("../visualizations/index_visu.html",'_self');
    }
    else if (name === 'HISTORY from image sources') {
        window.open("../../index.html",'_self');
    }
    else if (name === 'IMAGE SOURCES from history') {
        window.open("Website/history/image_sources.html",'_self');
    }
    else if (name === 'IMAGE SOURCES from team') {
        window.open("image_sources.html",'_self');
    }
    else if (name === 'TEAM from image sources') {
        window.open("team.html",'_self');
    }
    else if (name === 'TEAM from history') {
        window.open("Website/history/team.html",'_self');
    }
}

/* Section change function */
const goto = function(url) {
    document.getElementById(url.substring(1, url.length)).style.opacity="0";
    window.location=url;
    document.getElementById(url.substring(1, url.length)).style.webkitTransition="opacity 3s ease";
    document.getElementById(url.substring(1, url.length)).style.MozTransition="opacity 3s ease";
    document.getElementById(url.substring(1, url.length)).style.opacity="1";
}

/* STATS TIMELINE */
$(function() {
    $('.history-block').on('click', function(){
        $('.history-block').css('width', '300px');
        /*$('.history-block').find('.section-btn').css('width', '260px');*/
        $('.history-block .stats').hide(0);
        $(this).css('width', '650px');
        /*$(this).find('.section-btn').css('width', '600px');*/
        $(this).find('.stats').show(100);
    });
});

/* HISTORY */
$(function() {
    let scrollMagicController = new ScrollMagic;
    $(window).load(function() {

        // build scene
        let main = new ScrollScene({
            triggerElement: '#main_title',
        })
            .setTween(new TimelineMax().add([
                TweenLite.from(".main_title .line1", 1, { y: -70, opacity: 0 }),
                TweenLite.from(".main_title .line2", 1, { y: 80, opacity: 0 }).delay(1.3),
                TweenLite.from(".main_title .line3", 1, { y: 90, opacity: 0 }).delay(1.6),
                TweenMax.from(".main_title .line4", 1, { y: 100, opacity: 0 }).delay(3),
                TweenMax.from(".main_title .line5", 1, { y: 100, opacity: 0 }).delay(3.8),
            ]))
        main.addTo(scrollMagicController)
        //main.addIndicators();
    });

    let animated_text0 = new ScrollScene({
        triggerElement: '#at0',
        triggerHook: "0",
        duration: "1200",
        offset:100
    })
        .setTween(new TimelineMax().add([
            TweenMax.from("#heading0", 8, { y: 50, }),
        ]))
        .setPin('#at0');
    animated_text0.addTo(scrollMagicController);

    let animated_text_gif = new ScrollScene({
        triggerElement: '#at_gif',
        triggerHook: "0",
        duration:'700',
        offset:100
    })
        .setTween(new TimelineMax().add([
            TweenMax.from("#heading_gif", 1, { y: 0, }),
        ]))
        .setPin('#at_gif');
    animated_text_gif.addTo(scrollMagicController);

    let animated_images_gif = new ScrollScene({
        triggerElement: '#ai_gif',
        triggerHook: "1",
    })
        .setTween(new TimelineMax().add([
            TweenLite.from(".box01", 1, { y: 150, opacity: 0 }),
            TweenLite.from(".box01 h2", 1, { x: -150, opacity: 0 }).delay(1),
            TweenLite.from(".box01 p", 1, { x: -250, opacity: 0 }).delay(1),
            TweenLite.from(".box02", 1, { opacity: 0 }),
            TweenLite.from(".box02 h2", 1, { x: 150, opacity: 0 }).delay(1),
            TweenLite.from(".box02 p", 1, { x: 250, opacity: 0 }).delay(1),
        ]))
    animated_images_gif.addTo(scrollMagicController)


    let animated_text = new ScrollScene({
        triggerElement: '#at1',
        triggerHook: "0",
        duration: "2000",
        offset:100
    })
        .setTween(new TimelineMax().add([
            TweenMax.from("#heading", 8, { y: 100, }),
            TweenMax.from("#caption01", 8, { y: 1000, }).delay(1),
            TweenMax.from("#caption02", 8, { y: 1200, }).delay(2),
            TweenMax.from("#caption03", 8, { y: 1400, }).delay(3),
        ]))
        .setPin('#at1');
    animated_text.addTo(scrollMagicController);

    let animated_images = new ScrollScene({
        triggerElement: '#ai1',
        triggerHook: "0.9",
    })
        .setTween(new TimelineMax().add([
            TweenLite.from(".box01", 1, { y: 150, opacity: 0 }).delay(0.7),
            TweenLite.from(".box02", 1, { opacity: 0 }).delay(1.2),
            TweenLite.from(".box02 p", 1, { x: 250, opacity: 0 }).delay(1.7),
        ]));
    animated_images.addTo(scrollMagicController)

    let animated_text2 = new ScrollScene({
        triggerElement: '#at2',
        triggerHook: "0",
        duration:'2000',
        offset:100
    })
        .setTween(new TimelineMax().add([
            TweenMax.from("#heading2", 1, { y: 100, }),
            TweenMax.from("#caption04", 1, { y: 1000, }).delay(1),
            TweenMax.from("#caption05", 1, { y: 1200, }).delay(2),
            TweenMax.from("#caption06", 1, { y: 1400, }).delay(3),
        ]))
        .setPin('#at2');
    animated_text2.addTo(scrollMagicController);

    let slideParallaxScene = new ScrollScene({
        triggerElement: '#ap1',
        triggerHook: 0.5,
        duration: '500'
    })
        .setTween(new TimelineMax()
            .from('#cap1', 0.4, {autoAlpha: 0, ease:Power0.easeNone}, 0.4)
            .from('#apb1', 2, {y: '-50%', ease:Power0.easeNone}, 0));
    slideParallaxScene.addTo(scrollMagicController);

    let animated_text3 = new ScrollScene({
        triggerElement: '#at3',
        triggerHook: "0",
        duration:'2000',
        offset:100
    })
        .setTween(new TimelineMax().add([
            TweenMax.from("#caption07", 1, { y: 100, }),
            TweenMax.from("#caption08", 1, { y: 100, }),
        ]))
        .setPin('#at3');
    animated_text3.addTo(scrollMagicController);

    let slideParallaxScene2 = new ScrollScene({
        triggerElement: '#ap2',
        triggerHook: 0.5,
        duration: '500'
    })
        .setTween(new TimelineMax()
            .from('#cap2', 0.4, {autoAlpha: 0, ease:Power0.easeNone}, 0.4)
            .from('#apb2', 2, {y: '-50%', ease:Power0.easeNone}, 0));
    slideParallaxScene2.addTo(scrollMagicController);

    let animated_text4 = new ScrollScene({
        triggerElement: '#at4',
        triggerHook: "0",
        duration:'1500',
        offset:100
    })
        .setTween(new TimelineMax().add([
            TweenMax.from("#heading3", 1, { y: 100, }),
            TweenMax.from("#pele", 1, { y: 1200, }).delay(0.5),
            TweenMax.from("#caption09", 1, { y: 1000, }).delay(1),
            TweenMax.from("#caption10", 1, { y: 1200, }).delay(2),
        ]))
        .setPin('#at4');
    animated_text4.addTo(scrollMagicController);

    let animated_text5 = new ScrollScene({
        triggerElement: '#at5',
        triggerHook: "0",
        duration:'700',
        offset:100
    })
        .setTween(new TimelineMax().add([
            TweenMax.from("#heading4", 1, { y: 0, }),
        ]))
        .setPin('#at5');
    animated_text5.addTo(scrollMagicController);

    let animated_images2 = new ScrollScene({
        triggerElement: '#ai2',
        triggerHook: "1",
    })
        .setTween(new TimelineMax().add([
            TweenLite.from(".box03", 1, { y: 150, opacity: 0 }),
            TweenLite.from(".box03 h2", 1, { x: -150, opacity: 0 }).delay(1),
            TweenLite.from(".box03 p", 1, { x: -250, opacity: 0 }).delay(1),
            TweenLite.from(".box03 .inner-box", 1, { y: 150, opacity: 0 }).delay(1),

            TweenLite.from(".box04", 1, { opacity: 0 }),
            TweenLite.from(".box04 h2", 1, { x: 150, opacity: 0 }).delay(1),
            TweenLite.from(".box04 p", 1, { x: 250, opacity: 0 }).delay(1),
            TweenLite.from(".box04 .inner-box", 1, { y: 150, opacity: 0 }).delay(1),

            TweenLite.from(".box05", 1, { y: 150, opacity: 0 }).delay(2),
            TweenLite.from(".box05 h2", 1, { x: -150, opacity: 0 }).delay(2.5),
            TweenLite.from(".box05 p", 1, { x: -250, opacity: 0 }).delay(2.5),
            TweenLite.from(".box05 .inner-box", 1, { y: 150, opacity: 0 }).delay(2.5),

            TweenLite.from(".box06", 1, { opacity: 0 }).delay(2.5),
            TweenLite.from(".box06 h2", 1, { x: 150, opacity: 0 }).delay(3),
            TweenLite.from(".box06 p", 1, { x: 250, opacity: 0 }).delay(3),
            TweenLite.from(".box06 .inner-box", 1, { y: 150, opacity: 0 }).delay(3),
        ]))
    animated_images2.addTo(scrollMagicController)

    let animated_text6 = new ScrollScene({
        triggerElement: '#at6',
        triggerHook: "0",
        duration:'2000',
        offset:100
    })
        .setTween(new TimelineMax().add([
            TweenMax.from("#heading5", 1, { y: 100, }),
            TweenMax.from("#caption11", 1, { y: 1000, }).delay(1),
            TweenMax.from("#caption12", 1, { y: 1200, }).delay(2),
            TweenMax.from("#caption13", 1, { y: 1400, }).delay(3),
        ]))
        .setPin('#at6');
    animated_text6.addTo(scrollMagicController);

    let slideParallaxScene3 = new ScrollScene({
        triggerElement: '#ap3',
        triggerHook: 0.5,
        duration: '500'
    })
        .setTween(new TimelineMax()
            .from('#cap3', 0.4, {autoAlpha: 0, ease:Power0.easeNone}, 0.4)
            .from('#apb3', 2, {y: '-50%', ease:Power0.easeNone}, 0));
    slideParallaxScene3.addTo(scrollMagicController);

    let animated_text7 = new ScrollScene({
        triggerElement: '#at7',
        triggerHook: "0",
        duration:'700',
        offset:100
    })
        .setTween(new TimelineMax().add([
            TweenMax.from("#heading6", 1, { y: 0, }),
        ]))
        .setPin('#at7');
    animated_text7.addTo(scrollMagicController);

    let animated_images3 = new ScrollScene({
        triggerElement: '#ai3',
        triggerHook: "1",
    })
        .setTween(new TimelineMax().add([
            TweenLite.from(".box07", 1, { y: 150, opacity: 0 }),
            TweenLite.from(".box07 h2", 1, { x: -150, opacity: 0 }).delay(1),
            TweenLite.from(".box07 p", 1, { x: -250, opacity: 0 }).delay(1),
            TweenLite.from(".box07 .inner-box", 1, { y: 150, opacity: 0 }).delay(1),

            TweenLite.from(".box08", 1, { opacity: 0 }),
            TweenLite.from(".box08 h2", 1, { x: 150, opacity: 0 }).delay(1),
            TweenLite.from(".box08 p", 1, { x: 250, opacity: 0 }).delay(1),
            TweenLite.from(".box08 .inner-box", 1, { y: 150, opacity: 0 }).delay(1),

            TweenLite.from(".box09", 1, { y: 150, opacity: 0 }).delay(2),
            TweenLite.from(".box09 h2", 1, { x: -150, opacity: 0 }).delay(2.5),
            TweenLite.from(".box09 p", 1, { x: -250, opacity: 0 }).delay(2.5),
            TweenLite.from(".box09 .inner-box", 1, { y: 150, opacity: 0 }).delay(2.5),

            TweenLite.from(".box10", 1, { opacity: 0 }).delay(2.5),
            TweenLite.from(".box10 h2", 1, { x: 150, opacity: 0 }).delay(3),
            TweenLite.from(".box10 p", 1, { x: 250, opacity: 0 }).delay(3),
            TweenLite.from(".box10 .inner-box", 1, { y: 150, opacity: 0 }).delay(3),
        ]))
    animated_images3.addTo(scrollMagicController)
});
