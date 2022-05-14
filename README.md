<h1 style="text-align: center;">Stock Search</h1>
<p style="text-align: center;">
 A webpage that allows you to search for stock information, follow your favorite stock, and simulate stock transactions.   
</p>
<p style="text-align: center;">
   <a href="https://github.com/Vivian-Cheng/Stock-Search">Explore the docs >></a> • 
    <a href="">See demo >></a> •
    <a href="http://csci571nodejs-env.eba-sx8smmpb.us-west-1.elasticbeanstalk.com/">Link to webpage >></a>
</p>

![](/image/cover.gif)

### Table of Contents
* [Feature](#Feature)
* [Built With](#Built-With)
* [Getting Start](#Getting-Start)
* [Contact](#Contact)

## Feature
* **Autocomplete suggestions** - enter a keyword, populate a dropdown selection of suggested stock symbols for a simple search
* **Real-time stock prices and stock quotes** - show the latest stock quotes for a financial overview
* **Insight of stock analysis** - view historical data, recommendation trends, social sentiment, and the company's earnings
* **Up-to-date news** - watch the latest business and finance news
* **Portfolio management** - buy and sell stock through a virtual wallet
* **Watchlist management** - keep track of your favorite stocks by adding them to the watchlist

## Built With
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com)
- [Angular](https://angular.io)
- [Bootstrap](https://getbootstrap.com/)
- [Highcharts-angular](https://www.npmjs.com/package/highcharts-angular)
- [Finnhub Stock API](https://finnhub.io)

## Getting Start

### Prerequisites
* Install Node.js and npm
    ```sh
    $ npm install -g npm
    ```
### Installation
1. Get a free API Key at https://finnhub.io
2. Clone the repo
    ```sh
    $ git clone https://github.com/Vivian-Cheng/Stock-Search.git
    ```
3. Install NPM packages
    ```sh
    # Within the repository you cloned, install dependencies for backend
    $ npm install
    # Go into the frontend repository
    $ cd app
    # Install dependencies for frontend
    $ npm install
    ```
4. Enter your API Key in `/controllers/comp_controller.js`
    ```js
    const token = "{API_KEY}";
    ```
5. Build your frontend in `app` repository
    ```sh
    $ ng build
    ```
6. Run the app in `Stock-Search` repository
    ```sh
    node app.js
    ```
## Contact
* Vivian Cheng - vivian0422.c@gmail.com
* Project Link - https://github.com/Vivian-Cheng/Stock-Search
