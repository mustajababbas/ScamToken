
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
            clearInterval(checkWalletConnection);
            $('[id="connect-wallet"]').text('Connected');
            $("#address").text(checkAccount[0]);
            $("#wallet-details").toggle();
            $("#account-balance").toggle();
            $("#wallet-section").removeClass("wallet-section");
            
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
