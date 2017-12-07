var casper = require("casper").create({
    ignoreSslErrors:true,
    verbose: true});

var root_url = 'https://assure.ameli.fr';
var utils    = require('utils');
var fs       = require('fs');

var identifiant = casper.cli.raw.get('id').toString();
var password    = casper.cli.raw.get('pwd').toString();
var aim_path    = casper.cli.get('path').toString();

casper.on('step.complete', function(){
   var indice = 0;
   if(casper.cli.has('indice')){
     indice = casper.cli.get('indice');
   }
   if(casper.cli.has('screenshot')){
     this.capture('images/ameli_attestation_' + casper.step +'_'+indice+'.jpg', undefined,{ format:'jpg', quality:100});
   }
});


casper.options.logLevel    = 'info';
casper.options.verbose     = false;
casper.options.waitTimeout = 80000;

casper.on('step.start', function(){
   this.evaluate(function(){document.body.bgColor = 'white';});
});

// log all webapp js log
casper.on('remote.message',function(message){
  if(casper.cli.has("console")){
      this.echo(message, "INFO");
  }
});

casper.start();
casper.viewport(1024, 768);
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
casper.thenOpen(root_url);
casper.wait(1000);

casper.waitForSelector('form[name="connexionCompteForm"]');
casper.then(function(){
  this.fill('form[name="connexionCompteForm"]',{'connexioncompte_2numSecuriteSociale' : identifiant,
                                                'connexioncompte_2codeConfidentiel'   : password});
});
casper.thenClick('#id_r_cnx_btn_submit');


casper.waitForText('Attestation de droits');
casper.thenClick('#bpliable-header-attDroitsAccueilattDroitsItem');
casper.waitUntilVisible('#attDroitsAccueilidBenefs');

casper.thenEvaluate(function(){
  document.querySelector('#attDroitsAccueilidBenefs').value='PUT THERE YOUR ID';
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("change", false, true);
  document.querySelector('#attDroitsAccueilidBenefs').dispatchEvent(evt);

});
casper.wait(100);
casper.thenClick('#attDroitsAccueilidBtValider');
casper.waitForSelector('a.r_lien_pdf');
casper.then(function(){
  var year_label  = new Date().getFullYear().toString();
  var month_label = new Date().getMonth()+1;
  month_label = month_label.toString();
  if(month_label.length===1){
    month_label='0'+month_label;
  }
  f_name = aim_path+'stephane_attestation_'+year_label+'_'+month_label+'.pdf';
  if(!fs.exists(f_name)){
    this.download(this.evaluate(function(){ return document.querySelector('a.r_lien_pdf').href }), f_name);
  }
});
casper.thenClick('input[name="attDroitsAccueilorg.apache.struts.taglib.html.CANCEL"]');
casper.waitForText('Attestation de droits');

casper.thenEvaluate(function(){
  document.querySelector('#attDroitsAccueilidBenefs').value='PUT THERE YOUR ID';
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("change", false, true);
  document.querySelector('#attDroitsAccueilidBenefs').dispatchEvent(evt);
});
casper.wait(100);
casper.thenClick('#attDroitsAccueilidBtValider');
casper.waitForSelector('a.r_lien_pdf');
casper.then(function(){
  var year_label  = new Date().getFullYear().toString();
  var month_label = new Date().getMonth()+1;
  month_label = month_label.toString();
  if(month_label.length===1){
    month_label='0'+month_label;
  }
  f_name = aim_path+'teoman_attestation_'+year_label+'_'+month_label+'.pdf';
  if(!fs.exists(f_name)){
    this.download(this.evaluate(function(){ return document.querySelector('a.r_lien_pdf').href }), f_name);
  }
});
casper.thenClick('input[name="attDroitsAccueilorg.apache.struts.taglib.html.CANCEL"]');
casper.run();
