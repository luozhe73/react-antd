import React from 'react';
import {Button, Divider, Form, Icon, Input, InputNumber, Modal, Popconfirm, Select, Table, Tooltip} from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const {Column} = Table;
const FormItem = Form.Item;

const { Option } = Select;

class TableData extends React.Component {

    constructor() {
        super();
        this.state = {
            modifykey: 0,
            addormodify: 'add',
            modalVisible: false,
            dataSource: [],
            data: [
                {
                    key: '0',
                    name: 'John',
                    age: 31,
                    sex: 'man',
                    address: 'John@qq.com'
                },
                {
                    key: '1',
                    name: 'Jim',
                    age: 23,
                    sex: 'man',
                    address: 'Jim@qq.com'
                },
                {
                    key: '2',
                    name: 'Joe',
                    age: 123,
                    sex: 'man',
                    address: 'Joe@qq.com'
                },
            ]
        };
    }


    setModalVisible(value) {

        this.setState({modalVisible: value})
    }

    //新增用户信息
    handleSubmit(e) {

        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });

        let formData = this.props.form.getFieldsValue();

        if (this.state.addormodify == 'add') {
            console.log(this.state.dataSource);
            const list = {
                key: this.state.data.length,
                name: formData.r_name,
                age: formData.r_age,
                sex: formData.r_sex,
                address: formData.r_address
            };
            const dataSource = [...this.state.data, list];
            this.setState({
                data: dataSource
            });
            console.log(this.state.data);
        } else {

            const list = {
                key: this.state.modifykey,
                name: formData.r_name,
                age: formData.r_age,
                sex: formData.r_sex,
                address: formData.r_address
            };


            // const pre = this.state.data.slice(0, this.state.modifykey);
            // const next = this.state.data.slice(this.state.modifykey+1, this.state.data.length);
            // console.log("pre:"+pre);
            // console.log("next:"+next);
            // const dataSource = pre.concat(list).concat(next);
            // console.log(dataSource);
            const dataSource = [...this.state.data];
            dataSource.splice(this.state.modifykey, 1, list);

            this.setState({
                data: dataSource
            });

        }

    }

    //修改用户信息
    handleModifiy(key) {

        this.setModalVisible(true);
        console.log(key);
        this.setState({
            addormodify: 'modify',
            modifykey: key,
        })
    }

    handleAdd() {
        this.setModalVisible(true);
        this.setState({
            addormodify: 'add'
        })
    }

    handleDelete = key => {
        const dataSource = [...this.state.data];
        this.setState({data: dataSource.filter(item => item.key !== key)});
    };

    handleChange = value => {
        this.setState({
            dataSource:
                !value || value.indexOf('@') >= 0
                    ? []
                    : [`${value}@gmail.com`, `${value}@163.com`, `${value}@qq.com`],
        });
    };

    handleSelectChange = value => {
        console.log(value);
        this.props.form.setFieldsValue({
            note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
        });
    };

    render() {
        let {getFieldProps} = this.props.form;
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Button onClick={this.handleAdd.bind(this)} type="primary" style={{marginBottom: 16}}>
                    新增用户信息
                </Button>

                <Table dataSource={this.state.data}>
                    <Column title="序号" dataIndex="key" key="key"/>
                    <Column title="姓名" dataIndex="name" key="name"/>
                    <Column title="年龄" dataIndex="age" key="age"/>
                    <Column title="性别" dataIndex="sex" key="sex"/>
                    <Column title="邮箱" dataIndex="address" key="address"/>
                    <Column title="操作" key="action"
                            render={(text, record) => (
                                <span>
                            <Button type="primary" onClick={this.handleModifiy.bind(this, record.key)}>
                                修改
                            </Button>
                            <Divider type="vertical"/>
                             <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record.key)}>
                                 <Button type="danger">删除
                                 </Button>
                             </Popconfirm>
                        </span>
                            )}
                    />
                </Table>
                <Modal title='用户数据' wrapClassName='vertical-center-modal' visible={this.state.modalVisible}
                       onCancel={() => this.setModalVisible(false)}
                       onOk={() => this.setModalVisible(false)} okText='关闭'>
                    <Form onSubmit={this.handleSubmit.bind(this)}>

                        <Form.Item
                            label={
                                <span> 姓名&nbsp;
                                    <Tooltip title="应该怎样称呼您?">
                                    <Icon type="question-circle-o"/>
                                    </Tooltip>
                                </span>
                            }
                        >
                            {getFieldDecorator('r_name', {
                                rules: [{required: true, message: '请输入您的名字!', whitespace: true}],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="Gender">
                            {getFieldDecorator('r_sex', {
                                rules: [{required: false, message: 'Please select your gender!'}],
                            })(
                                <Select
                                    placeholder="Select a option and change input text above"
                                    onChange={this.handleSelectChange}
                                >
                                    <Option value="male">male</Option>
                                    <Option value="female">female</Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <FormItem label='年龄'>
                            <InputNumber placeholder='age'  min={1} required={true}
                                         max={120} {...getFieldProps('r_age')}/>
                        </FormItem>
                        <Form.Item label="电子邮箱">
                            {getFieldDecorator('r_address', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: false,
                                        message: 'Please input your E-mail!',
                                    },
                                ],
                            })(<Input/>)}
                        </Form.Item>
                        <Button type='primary'
                                htmlType='submit'>{this.state.addormodify == 'add' ? '新增' : '修改'}</Button>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default TableData = Form.create({})(TableData);
