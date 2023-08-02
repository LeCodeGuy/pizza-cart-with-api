document.addEventListener("alpine:init",()=>{

    Alpine.data('pizzaCart', ()=>{
        return{
            title:'Pizza Cart API',
            pizzas:[],
            username:'',//'LeCodeGuy',
            cartId: '',//'LeCodeGuyPizzas',
            cartPizzas:[],
            cartTotal: 0.00,
            paymentAmount: 0,
            message: '',
            login(){
                if(this.username.length > 2){
                    localStorage['username'] = this.username;
                    this.createCart();
                }else{
                    alert("Username is too short!");
                }
            },
            logout(){
                if(confirm('Do you want to  logout?')){
                    this.username = '';
                    this.cartId = '';
                    localStorage.clear();
                }                
            },
            createCart(){
                if(!this.username){
                    this.cartId = "No username to create a cart for"
                    return;
                }
                const createCartURL = 'https://pizza-api.projectcodex.net/api/pizza-cart/create?username='+this.username;
                const cartId = localStorage['cartId'];

                if(cartId){ //if a value exists for cartId in localStorage
                    // set cartId to localStorage cartId
                    this.cartId = cartId;
                }else{
                    //create a new cart
                    return axios
                            .get(createCartURL)
                            .then(result => {
                                this.cartId = result.data.cart_code;    // set cartId to the newly created cartId
                                localStorage['cartId'] = this.cartId;   // set localStorage cartId to the current cartId
                            });
                }                
            },
            getCart(){
                const getCartURL = 'https://pizza-api.projectcodex.net/api/pizza-cart/'+this.cartId+'/get'
                return axios.get(getCartURL);
            },
            addPizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })                
            },
            removePizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove',{
                    "cart_code": this.cartId,
                    "pizza_id":pizzaId
                })
            },
            pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay',{                
                    "cart_code" : this.cartId,
                    "amount" : amount
                })
            },

            showCartData() {
                this.getCart().then(result => {
                    const cartData = result.data;
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                });
            },

            init(){
                axios 
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result=>{
                        // code here
                        // console.log(result.data);
                        this.pizzas = result.data.pizzas
                        // code here...
                    });
                if(localStorage["username"] && localStorage["cartId"]){
                    this.username = localStorage["username"];
                    this.cartId = localStorage["cartId"];
                    
                    this.createCart()
                        // .then(()=>{
                        //     this.showCartData();
                        // })

                        this.showCartData();
                }
                

            },
            addPizzaToCart(pizzaId) {
                //alert(pizzaId);
                this
                    .addPizza(pizzaId)
                    .then(() => {
                        this.showCartData()
                    })
            },
            removePizzaFromCart(pizzaId){
                this
                    .removePizza(pizzaId)
                    .then(() => {
                        this.showCartData()
                    })
            },
            payForCart(){
                this
                    .pay(this.paymentAmount)
                    .then(result => {
                        if(result.data.status == 'failure'){
                            this.message = '😳 Oops! - That is not enough money.';
                            setTimeout(() => {
                                this.message = '';
                            }, 3000);
                        }
                        else{
                            this.message = '🤤 Enjoy your pizza!';
                            setTimeout(() => {
                                this.message = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0.00;
                                this.cartId = '';
                                this.paymentAmount = '';
                                localStorage.clear();
                                this.createCart();
                            }, 3000);
                        }
                    })
            }
        }
    });
});