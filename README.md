# Project of Data Visualization (COM-480)

## EPFL Spring 2020

| Student's name | SCIPER |
| -------------- | ------ |
| [Reynaud Alexandre](https://github.com/Skullservant) | 258402 |
| [Bouraux Léopold](https://github.com/leobouraux) | 257368 |
| [Rinaldi Vincent](https://github.com/vincentrinaldi) | 239759 |

[Milestone 1](#milestone-1-friday-3rd-april-5pm) • [Milestone 2](#milestone-2-friday-1st-may-5pm) • [Milestone 3](#milestone-3-thursday-28th-may-5pm)

## Milestone 1 (Friday 3rd April, 5pm)

**10% of the final grade**

### Dataset

The [<u>dataset</u>](https://www.kaggle.com/martj42/international-football-results-from-1872-to-2017) we use has been taken from Kaggle. It's a list of 41,586 international official football matches ordered in chronological order, starting from the very first one between England and Scotland on November 30, 1872 and ending on February 1, 2020 with the friendly match between USA and Costa Rica. The data has been gathered from several sources like Wikipedia, fifa.com, rsssf.com and individual football associations' websites. The dataset only consists of men's football matches between nations. It does not include women's matches, Olympic Games, matches involving a nation's B-team, U-23 or a football club from a national league. For each sample, we have the date of the match, the name of the home team and away teams (the current name of the teams has been used through all the years even if it had a different name before, in order to make easier the tracking of the statistics of a team), the full-time score for both home and away teams (if an overtime period occurred because of a draw, the full-time score includes this extra period, but doesn't include penalty-shootouts), the name of the concerned tournament, the city and country where the match took place (the name of the country at the time of the match is used, and can be different from the name actually used today), and a boolean value (```False``` if the home team was playing in its own country ```True``` otherwise).

The dataset at hand is pretty straight-forward. It seems to have no missing data nor corrupted information. That being said, some irrelevant information can be observed, like teams representing cities or regions, that are not affiliated with FIFA, and does not participate in major tournaments like the official World Cup or Continental Cups. Concerning preprocessing, since we want to only consider teams that are eligible for the World Cup to have accurate statistics on teams and perform efficient comparisons between them, we simply need to get rid of any team that is not affiliated with FIFA.

### Problematic

Our visualization is aiming to present an historical view of every football matches between nations since the beginning of football history. We want the user to be able to select a particular period from 1872 to 2020, in order to display the statistics from every match in this period. This can include the number of goals scored, the proportion of matches won, lost or drawn, championships won, the number of match or competitions hosted, a comparison of each team's performance, etc.  This visualization could also let us make assumptions on the pet peeve of each team, how much the fact of playing at home or hosting a tournament affects a country performances, etc.

We thought that the visualization could consist mainly of a world map with a slider along the screen side. The map would itself be a first layer of visualization, displaying high-level comparative information between teams during an interval chosen using the slider. Clicking on a country on the interactive map would display some detailed statistics. It would be also possible to compare two or more teams' statistics with a specific option that would be available at use after selecting the first team. We can also provide other views than a map to select a nation, like a grid, or a search bar. The user will also be able to select specifically the comparison criteria in order to filter the desired statistics.

Our motivation comes from the fact that it is difficult to find complete and up-to-date historical data on football, even though it is the most popular sport in the world. For instance, if a user wants to know the most successful team during a given period, our project will provide the answer. Football fans or journalists are often looking for informations concerning international matches. They would be thrilled to access a single interactive database containing what they need to complete successfully their research, instead of looking through tens of websites since the information is scattered a lot.

### Exploratory Data Analysis

You can find basic statistics and insight we provided on the dataset in the notebook *Exploratory Data Analysis.ipynb*. Here is the link to visualize the full notebook with interactive plots:
- [Full Exploratory Data Analysis](https://nbviewer.jupyter.org/github/com-480-data-visualization/com-480-project-le-kfc/blob/master/Exploratory%20Data%20Analysis.ipynb)

In summary, after performing preprocessing, 39654 samples of football matches are at our disposal, with 219 different teams and 104 different competitions. The exploratory data analysis showed us that the number of games has increased exponentially in the last decades, going from 2000 matches in the 1950s to more than 8000 matches in the 2010s. We obtained a mean of 362.13 matches played per team, but a large standard deviation of 245.58 for this statistic.

Concerning the number of goals scored by a team during a match, we obtain a mean of 1.44 goals per match, and a standard deviation of 1.56. In addition, 75% of the teams score 2 or less goals per match. The mean of the total number of goals scored in a single match is 2.89 with a standard deviation of 2.03.

The proportion of friendly (non-competitive) matches reaches 41.33%, and a huge majority of competitive matches are FIFA World Cup Qualification fixtures (more than 7000 games). The number of participants in the World Cup was not higher than 16 between 1930 and 1978. It went up to 24 in 1982 and reached 32 in 1998.

The USA hosted the highest number of football matches so far (more than 1000 games), and most of them are neutral (65.63% vs 34.37%) and friendly matches (representing more than 50% of the proportion of hosted matches in the USA). Concerning the cities, Kuala Lumpur organized the highest number of football games (between 550 and 600 matches). Most of the matches have been played on non-neutral fields (76.61% vs 23.39%), and the winner of those games is mostly the home team (65.70% vs 34.30%).

Finally, 9 teams are not affiliated to FIFA anymore in 2020, which are **Burma**, **Cook Islands**, **Czechoslovakia**, **East Timor**, **German DR**, **Saarland**, **Vietnam Republic**, **Yemen DPR**, **Yugoslavia**.

### Related Work

Concerning the use that has already be done by others with the data, we found a few studies that performed exploratory data analysis, like us, on this same dataset, but without getting too much in-depth :
- [Simple Football Data-set Exploration with Pandas](https://towardsdatascience.com/simple-football-data-set-exploration-with-pandas-60a2bc56bd5a)
- [Exploration on World Football Data](https://www.kaggle.com/microtang/exploration-on-world-football-data)

Concerning visualization work, the following provides an historical overview of the results of any football nation with the help of an interactive map :
- [All International Football Results](https://public.tableau.com/profile/kakuna#!/vizhome/AllFootballResults/Overview)

This last study is much closer to what we are striving for. This project makes possible to visualize the number of games won, drawn or lost by a given team against all other opponents between 1872 and 2017. The only possible variable, in addition to the choice of the team to be visualized, is the choice of the competition on which we want to display the statistics. However, these are the only criteria that this site provides. There is no option to directly compare two countries, to get statistics on the number of matches a city/country hosted or statistics on team playing at home or away. This visualization can then be greatly extended and updated with more recent results, since
the dataset has been kept up to date.

The originality of our approach comes from the fact that the visualization will allow the user to move through the whole football historical period, thanks to a slider, discovering many useful and interesting historical statistics that can rarely be found in one place. In addition, using a map will make our visualization much more interactive and user-friendly than other sources.

In terms of source of inspiration, the following visualizations played a major role in taking our final decision :
- [Histography - Matan Stauber](https://histography.io/)
- [Animation Of Surface Winds - earth.nullschool.net](https://earth.nullschool.net/)
- [100 Years Of Rock - ConcertHotels.com](https://www.concerthotels.com/100-years-of-rock/)

The three listed visualizations combine **user interaction**, **world map information** and **temporal evolution**, which composed the basis of our project motivations.

## Milestone 2 (Friday 1st May, 5pm)

**10% of the final grade**

You can access our report via the following link:
- [Milestone 2 Report](https://github.com/com-480-data-visualization/com-480-project-le-kfc/blob/master/Milestone%202%20Report.pdf)

Even though the main features of our website are not yet functional, it is structurally well developed: the architecture of the three main tabs is set and the buttons to access said tabs are working, the time period and flag sliders are fully built and in place as well as the country search bar but are not usable at the moment, and a basic and incomplete criterions menu with checkboxes and radio buttons is available but needs to be reworked. You can visualize the current state of our website here:
- [International Football Data Website](https://skullservant.github.io/international.football.io/)

We are now using in addition the following external dataset to load the country flag pictures. It has been completed with other flags to match every country we will depict. See [`Preprocessing.ipynb`](https://github.com/com-480-data-visualization/com-480-project-le-kfc/blob/master/Preprocessing.ipynb) for further details:
- [External Country Flag Dataset](https://data.world/pbi/country-flag-database-from-wikipedia)

## Milestone 3 (Thursday 28th May, 5pm)

**80% of the final grade**

The website can be directly run on Mozilla Firefow, Microsoft Edge, Google Chrome and Safari, and is not adapted for cell phones. You can access it either by clicking on the link at the end of the section, or by opening the index.html file in our GitHub repository.

The website presents an historical and statistical view of football matches between nations since the very beginning of football history, and is divided in three diferent tabs:

- The first tab is named **History** and presents an overview of the greatest football events concerning nations that occured since the end of the XIXth century. By scrolling down the page, you will be able to select a major event from an available interactive timeline to directly be sent to the corresponding section and access to the story of this event. You can also simply scroll down manually to visit every section ordered from top to bottom chronologically. Three different links are available at the very end of this page to access the repository of the website, the source of the images used for the different historical section of the page, and the list of the team members that built this website.

- The second tab is **Map** and displays a choropleth world map showing statistics about countries depending on the selected criterions that are located in two differents menus on the left of the screen that are [Measures] which gathers all the different kind of statistics that are available in our website, and [Competitions] that acts as a filter to focus only on the desired competitions. A time slider is available to select the time period on which we want to retrieve the statistics, as well as a flag slider to display data about the selected country. Simply click on the [Generate Data] button to load the statistics on the map. A legend will appear given details about the corresponding colors, as well as the highest and lowest recorded value. Note that information about a country can be also highlighted by hovering over a territory. Clicking on this territory, or on the corresponding flag, will save the value in a small box near the legend to record every user interaction with the map.

- The third tab is the **Details** tab which offer to the user other types of visualization to display the data. The criterions menus, flag slider, and time slider, are also available on this page. First, an horizontal bar plot gathering world-wide statistics can be displayed by clicking on the [Generate Data] button after selecting a measure and the desired competitions to focus on. Only one measure at a time can be selected in this situation. Secondly, the user can visualize statistics concerning a single country if he wants, by simply clicking on a country in the flag slider. Every measures will be available at selection at this moment. The user can display whatever statistic he wants by simply selecting the corresponding measures, and there is no need to press the [Generate Data] button anymore. The new horizontal bar plot will be updated immediately after any parameter change. Finally, the user, after selecting its first country, can select a second one to compare them over a chosen period of time for specific statistics. The procedure concerning the parameters selection is the same, and the plotted statistics will again update immediately each time the user modify its parameters selection. The resulting plot will not be a bar plot, but a table with each country statistics displayed in a different column, separared by a third column gathring the name of every selected measures. The cells of the values will be colored depending on their value compared to the other on the same measure.  

We use the follwing libraries with their corresponding version:

- Leaflet 0.7.1
- JQuery 1.12.4
- JQuery-UI 1.12.1
- D3.js 5.7.0
- Scrollmagic 1.3.0
- TweenMax 1.14.2

Our website is hosted via the following link:
- [Web Site Le-KFC Data Visualization Spring 2020 EPFL : International Football Data](https://skullservant.github.io/international.football.io/)

You can watch or download our screen cast by clicking on the following link:
- [Screencast Le-KFC Data Visualization Spring 2020 EPFL](https://drive.google.com/file/d/1g2SIYmflNMGMaUGoOa7PgznJqv9r7V4L/view?usp=sharing)

The Process Book is available in our repo under the name:
- [Process Book Le-KFC Data Visualization Spring 2020 EPFL](https://github.com/com-480-data-visualization/com-480-project-le-kfc/blob/master/Process%20Book.pdf)