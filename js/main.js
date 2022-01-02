
        async function checkConnection() {
        let web;
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        };

        const checkAccount = await window.web3.eth.getAccounts();

        if (checkAccount.length > 0) {
            $('.connectMetaMask').hide();
            $('body').prepend(`<div style="font-size: 12px;text-align: center;color:white;position: relative;top: 0px;z-index: 3;right: 0;width: 100%;background-color: #5548d7;padding: 5px 10px;">${checkAccount[0]}</div>`)
            clearInterval(checkWalletConnection);
            $('#connect-wallet').text('Connected');
            
        }
    }

    // Checking wallet connect or not
    var checkWalletConnection = setInterval(() => {
        checkConnection()
    }, 1000);
    checkConnection()

    // Connect Wallet
    async function loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            let ethereum = window.ethereum;
            const data = [{
                chainId: '0x4',
            }]
            const tx = await ethereum.request({ method: 'wallet_switchEthereumChain', params: data }).catch()
            if (tx) {
                console.log(tx)
            }

        }
    }

    // Get Current Account Address
    async function getCurrentAccount() {
        const accounts = await window.web3.eth.getAccounts();
        return accounts[0];
    }
    // Minting Funtion
    var erc;
    var manager_obj;
    var token_sale;
    var round;
    var rounddat;
    var link = window.location.href;
    var url = new URL(link);
    var sale_contract_address = url.searchParams.get("id");
    var BN ;
    async function mint() {
        erc = await new web3.eth.Contract(LASM.abi, LASM_addr);
        manger_contract_address = Manager_addr;
        manager_obj = await new web3.eth.Contract(Manager.abi, manger_contract_address);
        // croud_sale_contract_address = await manager_obj.methods.ico_addr().call();
        token_sale = await new web3.eth.Contract(Crowdsale.abi, sale_contract_address);
        BN = web3.utils.BN;
        // manager_contract_address = await erc.methods.manager_addr().call();
        fetchRounds()
        token_detail()
        console.log(await manager_obj.methods.owner().call())
        var manager_balance = await erc.methods.balanceOf(manger_contract_address).call();
        if(await manager_obj.methods.owner().call() == await getCurrentAccount()){
            $(".manager").append(`
            <input type="submit" onclick="finalize()" value="Finalize" class="custom-btn mt-2"
                                            name="submit">
            `)
            $(".current-balance").append(`
            <h5 class="text-white">Your Current Balance is : ${web3.utils.fromWei(manager_balance.toString(), 'ether')} LASM</h5>
            
            `)
        }
        // const mintAddress = $('#mintAddress').val();
        // let currentAccount = await getCurrentAccount();
        // console.log(mintAddress)
        // console.log(await erc.methods.mint(mintAddress).send({ from: currentAccount }));
        
    }
    async function token_detail(){
        sale_detail = await new web3.eth.Contract(Crowdsale.abi, sale_contract_address);
        var price = await sale_detail.methods.getPrice().call();
        var ammount_raised = await sale_detail.methods.weiRaised().call();
        var ammount_for_sale = await sale_detail.methods.balance().call();
        var token_sold = await sale_detail.methods._tokenPurchased().call();
        var max_avail = await new BN(ammount_for_sale).sub(new BN(token_sold)).toString();
        if(parseInt(max_avail) < 0){
            max_avail = '0';
        }
        $(".sale_contract_address").text(sale_contract_address)
        $(".token_address").text(LASM_addr)
        $(".price").text(web3.utils.fromWei(price.toString(), 'ether')+ " ETH")
        $(".name").text(await erc.methods.name().call());
        // console.log(await round.length)
        $(".symbol").text('('+ await erc.methods.symbol().call() +')');
        $(".ammount-raised").text(web3.utils.fromWei(ammount_raised.toString(), 'ether') + " BNB")
        $(".ammount-for-sale").text(web3.utils.fromWei(ammount_for_sale.toString(), 'ether'))
        $(".token-sold").text(web3.utils.fromWei(token_sold.toString(), 'ether'))
        console.log(web3.utils.fromWei(max_avail, 'ether'))
        $(".max-available").text(web3.utils.fromWei(max_avail.toString(), 'ether'))
        if(await sale_detail.methods.finalized().call() == false){
            $(".status").text('live')
            $(".status").css("color","green")
        }
        else{
            $(".status").text('expire')
            $(".status").css("color","red")
        }
        var timestamp = await sale_detail.methods.buyTime().call(),
        date = new Date(timestamp * 1000),
        datevalues = [
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        ];
    // Set the date we're counting down to
    // var countDownDate = new Date(datevalues[1]+" "+datevalues[2]+", "+datevalues[0]+" " +datevalues[3]+":"+datevalues[4]+":"+datevalues[5]).getTime();
    var countDownDate = new Date(datevalues[1]+" "+datevalues[2]+"," +datevalues[0]+ " "+datevalues[3]+":"+datevalues[4]+":"+datevalues[5]).getTime();
    //  distance;
    // Update the count down every 1 second
    var x = setInterval(function() {
    
      // Get today's date and time
      var now = new Date().getTime();
      // Find the distance between now and the count down date
    //   if(countDownDate > now){
        var distance = countDownDate - now;
    //   }
    //   else{
    //     distance = now - countDownDate;
    //   }
    
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
      // Display the result in the element with id="demo"
  
      document.getElementById("buy_days").innerHTML = days;
      document.getElementById("buy_hours").innerHTML = hours;
      document.getElementById("buy_minutes").innerHTML = minutes;

    
      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("buy_days").innerHTML = "00";
        document.getElementById("buy_hours").innerHTML = "00";
        document.getElementById("buy_minutes").innerHTML = "00";
      }
    }, 1000);




    var locktimestamp = await sale_detail.methods.limitationtime().call(),
    lockdate = new Date(locktimestamp * 1000),
    lockdatevalues = [
    lockdate.getFullYear(),
    lockdate.getMonth()+1,
    lockdate.getDate(),
    lockdate.getHours(),
    lockdate.getMinutes(),
    lockdate.getSeconds(),
    ];
// Set the date we're counting down to
// var countDownDate = new Date(datevalues[1]+" "+datevalues[2]+", "+datevalues[0]+" " +datevalues[3]+":"+datevalues[4]+":"+datevalues[5]).getTime();
var lockcountDownDate = new Date(lockdatevalues[1]+" "+lockdatevalues[2]+"," +lockdatevalues[0]+ " "+lockdatevalues[3]+":"+lockdatevalues[4]+":"+lockdatevalues[5]).getTime();
// var lockdistance;
// Update the count down every 1 second
var y = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
  // Find the distance between now and the count down date
//   if(lockcountDownDate > now){
    var lockdistance = lockcountDownDate - now;
//   }
//   else{
    // lockdistance = now - lockcountDownDate;
//   }

  // Time calculations for days, hours, minutes and seconds
  var lockdays = Math.floor(lockdistance / (1000 * 60 * 60 * 24));
  var lockhours = Math.floor((lockdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var lockminutes = Math.floor((lockdistance % (1000 * 60 * 60)) / (1000 * 60));
  var lockseconds = Math.floor((lockdistance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"

  document.getElementById("lock_days").innerHTML = lockdays;
  document.getElementById("lock_hours").innerHTML = lockhours;
  document.getElementById("lock_minutes").innerHTML = lockminutes;


  // If the count down is finished, write some text
  if (lockdistance < 0) {
    clearInterval(y);
    document.getElementById("lock_days").innerHTML = "00";
    document.getElementById("lock_hours").innerHTML = "00";
    document.getElementById("lock_minutes").innerHTML = "00";
  }
}, 1000);
    }
    async function fetchRounds(round) {
        round = await manager_obj.methods.noRounds().call();
        for(let i = 0; i< round;i++){
            var saleaddress = await manager_obj.methods.rounds(i).call()
            var sale_data = await new web3.eth.Contract(Crowdsale.abi, saleaddress);
            if(await sale_data.methods.finalized().call() == false){
                var status = 'live';
                var color = 'green'
            }
            else{
                var status = 'expire';
                var color = 'red'
            }
            var balance_token = await sale_data.methods.balance().call();
            $("#tbody").append(
                `<tr >
                <td ><img src="./images/favicon.png" class="token-icon" alt=""></td>
                <td >${i+1}</td>
                <td>${web3.utils.fromWei(balance_token.toString(), 'ether') + " LASM"}</td>
                <td>${saleaddress}</td>
                <td style="color:${color}">${status}</td>
                <td><a href="token-sale-detail.html?id=${saleaddress}" class="tab-custom-btn">View</a></td>
                </tr>`
                );
        }
        $(".table").attr("id",'myTable');
        $('#myTable').DataTable();
    }
    mint();
    async function manager() {
        
        var locktime = $("input[name='lockTime']").val();
        var rate = $("input[name='rate']").val();
        var percent = $("input[name='percent']").val();
        var add = await getCurrentAccount();
        var min = $("input[name='min']").val();
        // var add = await web3.utils.checkAddressChecksum();
        // const mintAddress = $('#mintAddress').val();
        // let currentAccount = await getCurrentAccount();
        // console.log(mintAddress)
        await manager_obj.methods.create_TokenSale(locktime,rate,web3.utils.toWei(percent, 'ether'),add,min).send({ from:  add , maxPriorityFeePerGas: null,
            maxFeePerGas: null },function(err, transactionHash) {
                if (!err)
                  console.log(transactionHash);
              
                var receipt = web3.eth.getTransactionReceipt(transactionHash);
              });

    }
    async function icoaddress() {
        var add = await getCurrentAccount();
        var price = $("input[name='value']").val();
        if(price >= 0.5 && price <= 1){
            var _value =await web3.utils.toWei(price.toString(), 'ether');
            await token_sale.methods.buyTokens().send({ from:  add , value: _value });
        }
        else{
            $("input[name='value']").css("border-color","red")
        }
        // console.log(erc.methods)
        // // var add = await web3.utils.checkAddressChecksum();
        // // const mintAddress = $('#mintAddress').val();
        // // let currentAccount = await getCurrentAccount();
        // // console.log(mintAddress)
        // ico_addr
 
    }
    
    async function claim() {
        // manager_contract_address = await erc.methods.manager_addr().call();
        var add = await getCurrentAccount();
        // var price = $("input[name='value']").val();

        // console.log(erc.methods)
        // // var add = await web3.utils.checkAddressChecksum();
        // // const mintAddress = $('#mintAddress').val();
        // // let currentAccount = await getCurrentAccount();
        // // console.log(mintAddress)
        // ico_addr
        // var _value =await web3.utils.toWei(price, 'ether');
        await token_sale.methods.claim().send({ from:  add });
    }
    
    async function finalize() {

        // console.log(token_sale.methods)
        // manager_contract_address = await erc.methods.manager_addr().call();
        var add = await getCurrentAccount();
        // var price = $("input[name='value']").val();

        // console.log(erc.methods)
        // // var add = await web3.utils.checkAddressChecksum();
        // // const mintAddress = $('#mintAddress').val();
        // // let currentAccount = await getCurrentAccount();
        // // console.log(mintAddress)
        // ico_addr
        // var _value =await web3.utils.toWei(price, 'ether');
       await token_sale.methods.Finalize().send({ from:  add });
    }