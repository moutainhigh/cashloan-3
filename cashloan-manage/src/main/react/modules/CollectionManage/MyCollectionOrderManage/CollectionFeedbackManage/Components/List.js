import React from 'react'
import {
  Table,
  Modal,
  Popover
} from 'antd';
var confirm = Modal.confirm;
const objectAssign = require('object-assign');
var testData = require('../../../../TestData/Json1');
export default React.createClass({
  getInitialState() {
    return {
      selectedRowKeys: [], // 这里配置默认勾选列
      loading: false,
      data: [],
      pagination: {},
      canEdit: true,
      dataRecord: '',
      visible: false,
      visibleAc: false,
      testData: testData.data5,
    };
  },
  componentWillReceiveProps(nextProps, nextState) {
    this.clearSelectedList();
    this.fetch(nextProps.params);
  },
  hideModal() {
    this.setState({
      visible: false,
      visibleAdd:false
    });
    this.refreshList();
  },
  //新增跟编辑弹窗
  showModal(title, record, canEdit) {
    var record = record;
    var me = this;
    Utils.ajaxData({
      url: '/modules/manage/borrow/repay/urge/listDetail.htm',
      data: {
        id: record.id
      },
      method: 'get',
      callback: (result) => {
        //console.log(result);
        me.setState({
          canEdit: canEdit,
          visibleAc: true,
          title: title,
          record: result.data.logs,
          dataRecord:result.data.logs
        });
      }
    });
  },
  //新增
  addModal(title, record, canEdit){
      this.setState({
        visibleAdd:true,
        title:title,  
      })

  },
  rowKey(record) {
    return record.id;
  },

  //分页
  handleTableChange(pagination, filters, sorter) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.refreshList();
  },
  fetch(params = {}) {
    this.setState({
      loading: true
    });
    if (!params.pageSize) {
      var params = {};
      params = {
        pageSize: 10,
        current: 1,
      }
    }
    Utils.ajaxData({
      url: '/modules/manage/borrow/repay/urge/collection/loglist.htm',
      data: params,
      method: 'get',
      callback: (result) => {
        const pagination = this.state.pagination;
        pagination.current = params.current;
        pagination.pageSize = params.pageSize;
        pagination.total = result.page.total;
        pagination.showTotal = () => `总共 ${result.page.total} 条`;
        if (!pagination.current) {
          pagination.current = 1
        };
        this.setState({
          loading: false,
          data: result.data,
          pagination
        });
      }
    });
  },
  clearSelectedList() {
    this.setState({
      selectedRowKeys: [],
    });
  },
  refreshList() {
    var pagination = this.state.pagination;
    var params = objectAssign({}, this.props.params, {
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    this.fetch(params);
  },
  changeStatus(title,record) {
    var me = this;
    var selectedRowKeys =me.state.selectedRowKeys;
    var id = record.id;
    var status;
    var msg = "";
    var tips = "";
    var trueurl = "";
      if (title == "加入黑名单") {
        msg = '加入黑名单';
        status = '20';
        tips = '您是否确定加入黑名单';
        trueurl = "/modules/manage/user/updateState.htm"
      } else if (title == "解除黑名单") {
        msg = '解除黑名单成功';
        status = '10';
        tips = '您是否确定解除黑名单';
        trueurl = "/modules/manage/user/updateState.htm"
      }
      confirm({
        title: tips,
        onOk: function() {
          Utils.ajaxData({
            url: trueurl,
            data: {     
              id: id, 
              state:status
            },
            method: 'post',
            callback: (result) => {
              if(result.code==200){
                Modal.success({
                 title: result.msg,
                });     
              }else{
                Modal.error({
                  title:  result.msg,
                });
              }
              me.refreshList();
            }
          });
        },
        onCancel: function() {}
      });
  },
  componentDidMount() {
    this.fetch();
  },

  onRowClick(record) {
    this.setState({
      selectedRowKeys: [record.id],
      selectedrecord: record
    });
  },
 
  render() {
    var me = this;
    const {
      loading,
      selectedRowKeys
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
    }; 
    const hasSelected = selectedRowKeys.length > 0;
    var columns = [{
      title: '借款人姓名',
      dataIndex: 'borrowName',
    }, {
      title: '手机号码',
      dataIndex: "phone",
    }, {
      title: '金额',
      dataIndex: 'amount'
    }, {
      title: '借款时间',
      dataIndex: 'borrowTime',
    }, {
      title: '预计还款时间',
      dataIndex: 'repayTime',
    }, {
      title: '逾期天数',
      dataIndex: "penaltyDay",
    }, {
      title: '逾期等级',
      dataIndex: 'level'
    }, {
      title: '罚息',
      dataIndex: "penaltyAmout",
    }, {
      title: '催收人',
      dataIndex: 'userName',
    }, {
      title: '订单状态',
      dataIndex: 'state',
      render:(text,record) =>  {
        switch(text){
          case "10": 
                    return "未分配";
                    break;
          case "11":
                    return "待催收";
                    break;
          case "20":
                    return "催收中";
                    break;
          case "30":
                    return "承诺还款";
                    break;
          case "40":
                    return "催收成功";
                    break; 
          case "50":
                    return "坏账";
                    break;         
        }
      }
    }, {
      title: '催收方式',
      dataIndex: "way",
      render:(text,record) =>  {
        switch(text){
          case "10": 
                    return "电话";
                    break;
          case "20":
                    return "邮件";
                    break;
          case "30":
                    return "短信";
                    break;
          case "40":
                    return "现场沟通";
                    break; 
          case "50":
                    return "其他";
                    break;         
        }
      }
    }, {
      title: '承诺还款时间',
      dataIndex: 'promiseTime',
      render:(text) => {
                if(text){
                    return text.substring(0,10)
                }
            }
    }, {
      title: '催收反馈',
      dataIndex: 'remark',
      render: (text, record) => {
              if (text.length >= 15) {
                  return <Popover content={text} overlayStyle={{width:"200px"}}>
                              <span>{text.substring(0,15)}...</span>
                          </Popover>
              } else {
                  return <span>{text}</span>
              }
          }
    },{
      title:'催收时间',
      dataIndex: 'createTime'
    }];
    var state = this.state;
    return (
      <div className="block-panel">
           <div className="actionBtns" style={{ marginBottom: 16 }}>
              {/*<button onClick={me.addModal.bind(me,'新增')} className="ant-btn"> 
                新增(测试)
              </button>*/}
            </div>
           <Table columns={columns} rowKey={this.rowKey}  
             onRowClick={this.onRowClick}  
             dataSource={this.state.data}
             pagination={this.state.pagination}
             loading={this.state.loading}
             onChange={this.handleTableChange}  />
         </div>
    );
  }
})