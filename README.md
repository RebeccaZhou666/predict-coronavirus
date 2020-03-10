# Predicting The Coronavirus

Gather data from people about their prediction on future coronavirus cases. 
See [Predicting The Coronavirus](https://rebeccazhou666-dwd-hw4.glitch.me/) Here.

Also video demo is here.
[![Watch the video](pictures/design2.png)](https://youtu.be/pN4CCRj_4L8)

# About
It's a dashboard that allows users to monitor the current coronavirus situation and predict the upcoming coronavirus case in the next day. Data source from [1point3acres](https://coronavirus.1point3acres.com/en).
<br /><br />
It contains mainly three parts: (1)the monitoring data of coronavirus history data from other websites; (2) user's input estimation data i total; (3) averaged estimated data by date.


# Prerequisites & Installation
If you want to use it on your computer, you need to download node and dependencies to run the project. Follow [this guide](https://github.com/itp-dwd/2020-spring/blob/master/guides/installing-nodejs.md) to install node.js. And also install the following dependencies.<br />

Install NeDB database.
~~~ 
npm install NeDB
~~~
Install express.js
~~~ 
npm install express
~~~
Install cheerio to run JQuery-like syntax
~~~ 
npm install cheerio
~~~
Install superagent to crawl data from website.
~~~ 
npm install supergent
~~~

# Inspiration

Coronavirus is scary. The more scary thing is people's attitudes towards it. Lots of people think that Asians overact and overestimate the coronavirus. So I'd like to make something to gather different people's opinions to see if this's true.<br /><br />
So I want to use people's prediction of the incoming coronavirus cases to see their attitudes in an indirect way. Most importantly, to see the differences among races.

# Reqirements
1. Dashboard-like interface.
2. Real-time coronavirus data(line chart), averaged predicted data (scatter)
3. Readl-time and averaged predicted data and people. 
4. Form to ask the prediction.

# Difficulties
There're lots of difficulties that I can foresee, like crawling data. But there're way much more problems that I can only realize when I actually do it. I'd like to record every of my obstacle here.

<strong>About Data Crawling</strong><br />
I thought it was simple because I used Python to crawl data once. Here in node.js, I used ```supergeny + cheerio``` to crawl data from the website. But the [website](https://coronavirus.1point3acres.com/en) used [Echarts](https://www.echartsjs.com/en/index.html) to load the data dynamically and the default language of the page is Chinese, which made the original crawling data hard to clean. 
<br />What made things hard was that the website is super unstructured and the ``` class ``` for different sets of data was messy. Originally I planned to crawl the coronavirus cases in NY but had to give up due to the messy structure. 
<br />And the website updates the charts a lot. If the code doesn't work, try to compare the data I crawled with the inspected element in the web to see if the element ``` class ``` changes.
~~~
function crawlStats(){ 
  superagent.get('https://coronavirus.1point3acres.com/en').end((err, res) => { //  use superagent npm to crawl website
  if (err) {
  } else { 
    stat = getStats(res); 
  }});
}

let getStats = (res) => {  
  let $ = cheerio.load(res.text); // load website and analyze in Jquery syntax
  $('strong.jsx-889234990').each((idx, ele) => { //  the element I crawl, choose strong && .jsx-889234990 
      if(idx < 3) today_stats.push(parseInt($(ele).text())); // the first three data: confirmed, recovered, death.
    });
    console.log(today_stats)
    return today_stats;
};
~~~
<strong>About Database Setup</strong><br />

Database is the hardest part from my perspective. It went smoothly when I used local JSON to store my data, to insert, update, delete. But when it came to the NeDB, I encountered lots of obstacles <strong> I still cannot solve</strong>.<br />
- I cannot update the data.  
It's simple and easy. The only hard thing is how to visualize it creatively.<br />


The sketch is as below.
![sketch of website](pictures/sketch.png)

I didn't draw the wireframe since the structure of the web is super simple. I spent most of the time finding proper illustrations for the website. After browsing tons of resources, I luckily find an interesting gif met my need. 
![cat](pictures/cat.gif)
[walking cat](https://dribbble.com/shots/9893340-Django-the-Cat)

Great! To pair it with a lover, I simply drew a sitting black cat and animated in AE. I encountered lots of obstacles in making transparent gifs. Eg. making transparent gif while removing the previous image at the same place. Finally, I got some free vector illustrations from [freepik](https://www.freepik.com/). Yeah! Materials all set.<br />

The next step is to design hi-fi prototype in sketch. There are two status of the page. When the data is back, there'll be showing as a compatibility percentage and the cat will move accordingly.
![color palette](pictures/color.png)
![design1](pictures/design1.png)
![design2](pictures/design2.png)

# Development

I used```vh vw``` , ```@media``` and also ```normalize.css``` just like my last assignment. 

<h2> API</h2>

When I used API, at first I forgot to sign up into the rapid API website so that the key I got was invalid. After seeing the status 401 code.I realized and signed in and got the right one.<br />
Then I met the problem of CORS. I searched online and solved problem by adding ```'Access-Control-Allow-Origin': '*'``` in ```header```. I annotated the Javascript ```fetch```code in ```main.js``` because I mainly used ```JQuery```to control css (it's neat).![CORS](pictures/CORS.png)

<h2> Supportive Interaction</h2>

There's an animation of result. I used ```setTimeOut``` to make loop function delay so that I can create a number increasing effect.![loop](pictures/loop.png)<br />

<h2> Deployment</h2>

Login Glitch.com, create a new project by cloning from Git Repo, and paste the URL to finish.<br /><br />

# Reference
[normalize.css](https://necolas.github.io/normalize.css/)

## Credit to
* [Love Calculator API](https://english.api.rakuten.net/ajith/api/love-calculator)
* [Jendrik Kleefeld] (https://dribbble.com/jokomango)
* [Freepik](https://www.freepik.com/)

## Built with

* [VS Code](https://code.visualstudio.com/)
* [Github](https://github.com)
* [Glitch](https://glitch.com/)

## Author

* [Rebecca Zhou](https://rebeccazhou.net) 
