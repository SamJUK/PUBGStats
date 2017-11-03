# CURRENTLY DOES NOT WORK
# THE API WE FETCH PLAYER DATA FROM IS CURRENTLY DISABLED DUE TO BLUE STUDIOS RATE LIMITING
# THE API WILL WE AVAILABLE AGAIN SOON WATCH FOR MORE INFO
# https://pubgtracker.com/site-api
# https://twitter.com/trackernetwork/status/925896362914299904


# Readme
### Setup
 - Clone the repo
 - Create a file called **pubg.credential** in the root folder containg your pubg API key (How do i get my API key?)
 

 ### Getting an API Key
 - Create an account at https://pubgtracker.com/site-api
 - Then click **Generate API Key**
 - Your key is value of the pair eg. (The bold part)(TRN-Api-Key: **xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx**)

 ### How do i know what index each stat is?
 - Inside the **scripts** folder there is a statsIndexDump.txt file that contains all the indexs for each stat.
 - To update this list, change the **url** parameter within the js file to the stats.php file in the project root and pass it a valid user e.g (http://example.ext/pubg/stats.php?u=samjuk)
