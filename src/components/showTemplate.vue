<template>
    <div style="height: 100%">
<div class="header">
        <div class="head-nav-left flex">
            <img src="../assets/logo_skin.png" alt>
            <span style="white-space:nowrap;">&nbsp;&nbsp;问鼎皮肤</span>
        </div>
</div>
    <div style="
                height: calc(100% - 50px);
                text-align: center;
                margin: 0px auto;
                background: linear-gradient(to left, #69afc7, #92dbf3);;
                padding-top: 25px;
               ">
        <div style="padding-bottom: 40px;"><h1 style="margin: 0px;font-family: monospace;">{{title}}</h1></div>
        <fm-generate-form
                style="padding-bottom: 25px;"
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                ref="generateForm">
        </fm-generate-form>
        <el-button @click="submitForm()"  size="small">提交</el-button>
</div>
    </div>
</template>
<script>
    import gql from 'graphql-tag';
    export default {
        name: '',
        data() {
            return {
                formRequestParams:`
                id
                team_id
                doctor_id
                templ_name
                templ_content
                remarks
                created_time
                update_time
                    ` ,
                title:'问卷调查',
                remoteFuncs: {
                    // 组件配置时配置的远端方法,保持和配置时输入的名称一致
                    func_test (resolve) {
                        // 模拟接口请求
                        setTimeout(() => {
                            const options = [
                                {id: '1', name: '1111'},
                                {id: '2', name: '2222'},
                                {id: '3', name: '3333'}
                            ]

                            // 获取到的值和标签可以通过配置页远端配置
                            // 值:id  标签：name
                            resolve(options) // 将后端获取的数据放入回调函数中
                        }, 2000)
                    },

                },
                values: {},
                jsonData:
                    {"list":[{"type":"select","icon":"icon-select","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"","required":false,"showLabel":false,"width":"","options":[{"value":"Option 1"},{"value":"Option 2"},{"value":"Option 3"}],"remote":false,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"func_1582178702000_58597"},"name":"下拉选择框","key":"1582178702000_58597","model":"select_1582178702000_58597","rules":[]},{"type":"select","icon":"icon-select","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"","required":false,"showLabel":false,"width":"","options":[{"value":"Option 1"},{"value":"Option 2"},{"value":"Option 3"}],"remote":false,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"func_1582178703000_5399"},"name":"下拉选择框","key":"1582178703000_5399","model":"select_1582178703000_5399","rules":[]}],"config":{"labelWidth":100,"labelPosition":"right","size":"small"}}
                ,
            };
        },
        methods:{
            getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg); // 匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; // 返回参数值
            },
            submitForm(){
                const json = this.$refs.generateForm.getData()
                let resValue;
                json.then(function (result) {
                    console.log(result)
                        resValue = result;
                })
            },
           async init(){
                let id = this.getUrlParam('templateId');
                if (id!=null){
                    let variables = {id:id}
                    const response = await this.$apollo.query({
                        query: gql`query($id: Int!){
                     getTemplateById(id: $id){
                     ${this.formRequestParams}
                     }
                   }`,
                        variables,
                    });
                    let res = response.data.getTemplateById
                    this.title = res.templ_name;
                    this.jsonData = JSON.parse(res.templ_content)
                }else {
                    this.$message.error("获取模板失败");
                }
           }
            },
        created(){
            this.init();
        }
        }

</script>
<style>
    .header {
        background: linear-gradient(to left, #67b4cd, #2fa6ce);
        background: -ms-linear-gradient(to left, #67b4cd, #2fa6ce);
        background: -moz-linear-gradient(to left, #67b4cd, #2fa6ce);
        display: flex;
        align-items: center;
        height: 50px;
        justify-content: space-between;
    }
    .header div {
        margin-left: 20px;
        margin-right: 20px;
        color: white;
        font-size: 20px;
    }
    .header img {
        width: 40px;
        height: 30px;
    }
</style>