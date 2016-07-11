console.log('Starting password manager app!');

var crypto = require('crypto-js');
var storage = require('node-persist');
storage.initSync();

var argv = require('yargs')
		.command('create','Create a new account',function(yargs){
			yargs.options({
				name: {
					demand: true,
					alias: 'n',
					description: 'Account name (eg: Twitter, Facebook)',
					type: 'String'
				},
				username:{
					demand: true,
					alias: 'u',
					description: 'Account username or email',
					type: 'String'
				},
				password: {
					demand: true,
					alias: 'p',
					description: 'Account password',
					type: 'String'
				},
				masterPassword:{
					demand: true,
					alias: 'm',
					description: 'Master password',
					type: 'String'
				}
			}).help('help');
		})
		.command('get','Get an existing account',function(yargs){
			yargs.options({
				name:{
					demand: true,
					alias: 'n',
					description: 'Account name (eg: Twitter, Facebook)',
					type: 'String'
				},
				masterPassword:{
					demand: true,
					alias: 'm',
					description: 'Master password',
					type: 'String'
				}
			}).help('help')
		})
		.help('help')
		.argv;
var command = argv._[0];

function getAcconts(masterPassword){
	//  Use getItemSync to fetch accounts
	var encryptedAccounts = storage.getItemSync('accounts');
	var accounts = [];

	// Decrypt
	if (typeof encryptedAccounts !== 'undefined'){
		var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
	  accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
	}

	// return accounts array
	return accounts;
};

function saveAccounts(accounts, masterPassword){
	// Ecrypt accounts
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts),masterPassword);
		
	// setItemSync 
	storage.setItemSync('accounts',encryptedAccounts.toString());
	
	// Return account
	return accounts;
};

function createAccount(account, masterPassword){
	var accounts = getAcconts(masterPassword);
	
	accounts.push(account);
	
	saveAccounts(accounts, masterPassword);
	
	return account;
};

function getAccount(accountName, masterPassword){
	var accounts = getAcconts(masterPassword);
	var matchAccount;
	accounts.forEach(function(account){
		if(account.name === accountName){
			matchAccount = account;
		}
	});
	return matchAccount;
};

if(command === 'create'){
	try{
		var createdAccount = createAccount({
			name: argv.name,
			username: argv.username,
			password: argv.password
		}, argv.masterPassword);
		console.log('Account Created!');
		console.log(createdAccount);
	}catch(e){
		console.log('Unable to create account.');
	}

}else if(command === 'get'){
	try{
		var fetchAccount = getAccount(argv.name, argv.masterPassword);
			if(typeof fetchAccount === 'undefined'){
				console.log('Account not found :(');
			}else{
				console.log('Account found!');
				console.log(fetchAccount);
			}
	}catch(e){
		console.log('Unable to get account');
	}
}













