---------------
**Company Scoring**
---------------

--> **Quick overview**

This repository hosts a side project file on company scoring. Based on various management theories, one can evaluate his company through this website. The score is made of two grades:
    - One about the external interactions of the company (/5)
    - One about the internal structure of the company (/5)
The final score is thus a couple of grades. As a mean to compare a company to another, this website features a 2D plot based on those grades to visualize one's company's position.

--> **Technical overview**
This repository uses:
    - Basic Website development tools (HTML, JS, CSS)
    - CSS Tailwind Framework
    - Google Forms and Google Scripts automation
    - Chart JS Framework

Following is the theorical scoring scheme:
    || Users enter their company's name -> They're redirected to a Google Form (external analysis) -> They're redirected to another Google Form (internal analysis) -> A google script fetches both answers and compute the scores -> The website reads the score and plot the company's position ||

--> **Credits**
    A github repository for the website template. I couldn't find it again.
