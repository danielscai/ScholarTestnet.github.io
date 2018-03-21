/**
 * @author yahuang.wu
 * @date : 2018.03.19
 * @desc : generate and refresh block producer data
 */

var ScholarTest = {
  lastIrreversibleBlock: 0,
  numberOfBlocks: 0,
  producerList: window.producerList,
  init: function () {
    document.getElementById('configuredProducer').innerText = window.producerList.length.toString();
    this.lastBlockElement = document.getElementById('lastBlockEle');
    this.numberOfBlocksEle = document.getElementById('numberOfBlocksEle');

    this.generateProducerTable();
    this.updateData();
  },
  // load 21 BP's info from producer.js, then generate the BP HTML table.
  generateProducerTable: function () {
    var producerList = window.producerList;
    var BPTable = document.getElementById('BPTable');
    for (var i = 0; i < producerList.length; i++) {
      var html = '<tr class="item">' +
        '<th><div class="producer-logo">' +
        '<img src="' + producerList[i].logo + '"/>' +
        '</div><span>' + producerList[i].producer + '</span></th>' +
        '<th>' + producerList[i].name + '</th>' +
        '<th>' + producerList[i].contact + '</th>' +
        '<th class="item-last-block"></th>' +
        '<th>' + producerList[i].URL + '</th>' +
        '<th>' + producerList[i].HTTP + '</th>' +
        '<th>' + producerList[i].P2P + '</th>' +
        '<th class="item-time"></th>';

      var tr = document.createElement("tr");
      tr.class = 'item';
      tr.id = producerList[i].producer;
      tr.innerHTML = html;
      BPTable.appendChild(tr);
    }
  },
  // update every BP's last irreversible block and number of blocks dynamically
  updateData: function () {
    var self = this;
    for (var i = 0; i < self.producerList.length; i++) {
      var targetProducerObj = document.getElementById(self.producerList[i].producer);

      function refreshData(targetProducerObj) {
        self.get(producerList[i].API_URL + '/v1/chain/get_info', function (data) {
          targetProducerObj.querySelector('.item-last-block').innerText = data.last_irreversible_block_num;
          targetProducerObj.querySelector('.item-time').innerText = data.head_block_time.replace('T', ' ');


          // detect lastIrreversibleBlock and numberOfBlocks
          if (data.last_irreversible_block_num > self.lastIrreversibleBlock) {
            self.lastBlockElement.innerText = data.last_irreversible_block_num;
            self.lastIrreversibleBlock = data.last_irreversible_block_num;
          }

          if (data.head_block_num > self.numberOfBlocks) {
            self.numberOfBlocksEle.innerText = data.head_block_num;
            self.numberOfBlocks = data.head_block_num;
          }
        }, function (error) {
          console.log(error);
        });
      }

      refreshData(targetProducerObj);
    }

    setTimeout(function () {
      self.updateData();
    }, 3000);
  },
  // HTTP GET REQUEST
  get: function (url, successCallback, errorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
      if (request.status === 200) {
        successCallback(JSON.parse(request.responseText));
      }
      else {
        errorCallback(request);
      }
    };

    request.onerror = function (request) {
      // There was a connection error of some sort
      errorCallback(request);
    };

    request.send();
  }
};

ScholarTest.init();