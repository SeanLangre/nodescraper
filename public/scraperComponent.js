// import fetch from 'node-fetch'
// import { Scraper } from "./scraper.js"

const template = document.createElement('template')
template.innerHTML = `
  <style>
    main {
      height:20px;        
      width:100%;
      font-family: 'Roboto', sans-serif;
      background-color: #36393f;
      margin: 0px;
    }

    p{
      font-size: 60px;
    }
  </style>

  <main>
    <div>
      component: asdasdasdasd
    </div>

    <p id=welcomeMessage> </p>

  </main>
`

customElements.define('mainTemplateScraper',
  class extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.welcomeMessage = this.shadowRoot.querySelector('#welcomeMessage')
      this.welcomeMessage.textContent = "ASIUFBGASUIBFASBHUIO"
    }

    test() {
      console.log("asiugfakjsbfkjabsdgkjasdbg");
    }
  }
)

      // constructor() {
    //   super()
    //   this.attachShadow({ mode: 'open' })
    //     .appendChild(mainTemplate.content.cloneNode(true))
    //   this.welcomeMessage = this.shadowRoot.querySelector('#welcomeMessage')
    //   this.userMessage = this.shadowRoot.querySelector('#userMessage')
    //   this.userNameInput = this.shadowRoot.querySelector('#userNameField')
    //   this.setUserName = this.shadowRoot.querySelector('#setUserName')
    //   this.inspirationalQuote = this.shadowRoot.querySelector('#inspirationalQuote')
    //   this.userMessage.hidden = true
    //   this.amountOfClicks = 0
    //   this.setWelcomeMessage()
    // }

    // setWelcomeMessage() {
    //   let baseMessage = `Hi there, ${this.setNickName()}! What's your name?`
    //   this.welcomeMessage.textContent = baseMessage
    // }

    // setNickName() {
    //   let nickNameArray = [' cutie', ' sweetie', ' honey', ' doll', ' hon’', ' peach', 'sugar']
    //   let nickName = nickNameArray[this.getRandomNumber(nickNameArray.length)]
    //   return nickName
    // }

    // getRandomNumber(span) {
    //   return Math.floor(Math.random() * span)
    // }

    // connectedCallback() {

    //   this.setUserName.addEventListener('click', async event => {
    //     event.preventDefault()
    //     this.removeGenericMessageTag()
    //     this.amountOfClicks++
    //     if (this.amountOfClicks >= 1) {
    //       this.hideGreeting()
    //     }
    //     if (this.amountOfClicks === 1) {
    //       this.setUserMessage()
    //     } else if (this.amountOfClicks > 1) {
    //       this.hideUserMessage()
    //     }
    //     this.createGenericMessageTag()
    //     this.showQuoteText()
    //   })
    // }

    // setGenericMessageText() {
    //   let nickName = this.setNickName()
    //   let genMessageArray = [`Here ${nickName}, have some motivation on me!`, `Life is hard sometimes - I hope this gives you some inspiration, ${nickName}! `,
    //   `I got a special quote just for you, ${nickName}!`,
    //   `Let's hope this makes your day a bit better , ${nickName}!`,
    //   `Let's see if this won't make you feel inspired today, ${nickName}!`,
    //   `Let's see if this won't make you feel inspired today, ${nickName}!`,
    //   `We all need a little pick me up sometimes - here's something I hope will inspire you, ${nickName}!`,
    //   `Sometimes we need some perspective, ${nickName} - here's an inspirational quote to help you through your day!`]
    //   let genMessage = genMessageArray[this.getRandomNumber(genMessageArray.length)]
    //   return genMessage
    // }

    // removeGenericMessageTag() {
    //   let pTagToRemove = this.shadowRoot.querySelector("#newPTag")
    //   if (pTagToRemove != null) {
    //     pTagToRemove.remove()
    //   }
    // }

    // createGenericMessageTag() {
    //   const newPTag = document.createElement("p");
    //   newPTag.id = 'newPTag'
    //   const newContent = this.setGenericMessageText()
    //   newPTag.innerText = newContent
    //   const inspirationalQuote = this.shadowRoot.querySelector("#inspirationalQuote")
    //   inspirationalQuote.parentNode.insertBefore(newPTag, inspirationalQuote)

    // }

    // async showQuoteText() {
    //   this.inspirationalQuote.innerText = await this.setQuoteText()
    // }

    // hideGreeting() {
    //   this.userNameInput.hidden = true
    //   this.welcomeMessage.hidden = true
    // }

    // hideUserMessage() {
    //   this.userMessage.hidden = true
    // }

    // setUserMessage() {
    //   this.userMessage.hidden = false
    //   if (this.userNameInput.value === '') {
    //     let anonymousUserMessage = 'I understand. There are times when you just want to blend into a crowd and not stand out. I got you. '
    //     this.userMessage.innerText = anonymousUserMessage
    //   } else if (this.userNameInput.value !== '') {
    //     this.userMessage.innerText = `Hello there, ${this.userNameInput.value}. It's lovely to see you!`
    //   }
    // }

    // async setQuoteText() {
    //   let quotesArray = await this.getQuotesFromAPI()
    //   let quote = quotesArray[this.getRandomNumber(quotesArray.length)]
    //   let quoteText = quote.text
    //   let quoteAuthor = quote.author
    //   if (quoteAuthor === null) {
    //     quoteAuthor = '- Unknown'
    //   } else {
    //     quoteAuthor = '- ' + quote.author

    //   }
    //   let inspirationalQuoteAuth = quoteText + "\n" + quoteAuthor
    //   return inspirationalQuoteAuth
    // }

    // async getQuotesFromAPI() {
    //   const response = fetch("https://type.fit/api/quotes")
    //     .then((response) => {            // THIS IS THE SAME AS
    //       return response.json()
    //     })
    //     .then((data) => {           // THIS
    //       return data
    //     })
    //   return response
    // }