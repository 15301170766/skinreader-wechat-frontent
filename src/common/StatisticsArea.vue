<template>
  <div class="unified-container">
    <div class="top-head-wrap" :class="areaArgument.from">
      <div class="pic iconfont" :class="[areaArgument.from, areaArgument.style.icon1]">
        <div class="message-alert" v-if="false"></div>
      </div>
      <div class="content">
        <div class="hospital-search">
          <div class="all-btn" :class="{'from-top': areaArgument.from === 'from-top', 'from-bottom': areaArgument.from === 'from-bottom', active: searchValue === ''}" @click="handleSelectRange()">全部</div>
          <div class="input-wrap">
            <input class="search-input" :class="{'from-top': areaArgument.from === 'from-top', 'from-bottom': areaArgument.from === 'from-bottom', active: searchValue !== ''}" type="text" :placeholder="areaArgument.style.placeholder" v-model="searchValue">
            <div class="icon-search iconfont">&#xe666;</div>
          </div>
        </div>
        <div class="sum-wrap">
          <div class="left-box">
            <div class="sum-label">{{areaArgument.style.label1}}</div>
            <div class="sum-number" :class="areaArgument.from">{{showCount | numberFormat}}</div>
          </div>
          <div class="right-box" v-if="areaArgument.type === 'active'">
            <div class="sum-label">在线人数</div>
            <div class="sum-number" :class="areaArgument.from">{{onlineDoctorCount}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-wrap">
      <div class="btn-wrap">
        <div class="btn" :class="{'from-top': areaArgument.from === 'from-top', 'from-bottom': areaArgument.from === 'from-bottom', active: dateRangeType === 'week'}" @click="handleDateRangeType('week')">周</div>
        <div class="btn" :class="{'from-top': areaArgument.from === 'from-top', 'from-bottom': areaArgument.from === 'from-bottom', active: dateRangeType === 'month'}" @click="handleDateRangeType('month')">月</div>
      </div>
      <el-date-picker
        class="date-picker"
        :class="{'from-top': areaArgument.from === 'from-top', 'from-bottom': areaArgument.from === 'from-bottom', active: dateRangeType === 'date'}"
        :clearable="false"
        v-model="datePickerRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleDateRangeType('date')"
      >
      </el-date-picker>
    </div>
    <div class="number-info-wrap">
      <div class="iconfont icon" :class="[areaArgument.style.icon2, areaArgument.style.icon2Class]"></div>
      <div class="content-wrap">
        <div class="title-wrap">
          <div class="label">{{areaArgument.style.label1}}</div>
          <div class="date">{{dateRange.startDate}}~{{dateRange.endDate}}</div>
        </div>
        <div class="info-wrap">
          <div class="num">{{showCount | numberFormat}}</div>
          <div class="floating" v-show="dateRangeType !== 'date'">
            <div class="iconfont icon-up" v-show="floatationIcon === 'up'">&#xe605;</div>
            <div class="iconfont icon-down" v-show="floatationIcon === 'down'">&#xe604;</div>
            <div class="floating-num" v-show="floatation">{{floatation}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="line-chart-wrap">
      <div class="echart-wrap" ref="myChart"></div>
      <div class="title">{{areaArgument.style.label2}}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import echarts from 'echarts';
import gql from 'graphql-tag';
export default {
  name: '',

  props: {
    areaArgument: Object,
  },

  data() {
    return {
      // 显示的数量
      showCount: 0,
      // 精确查找延迟定时器
      searchValueTimer: null,
      // 搜索内容 精确查找
      searchValue: '',
      // 查找的时间类型: week 周, month 月, date 用户自己选择的
      dateRangeType: 'week',
      // 日期范围选择器绑定数据
      datePickerRange: [],
      // 百分比浮动数值的iconfont类型: up 上升, down 下降
      floatationIcon: '',
      // 百分比浮动数值
      floatation: '',
      // 折线图参数
      myChart: '',
      myOption: {
        color: ['#e8984d'],
        tooltip: {
          show: false,
        },
        grid: {
          x: 50,
          y: 40,
          x2: 30,
          y2: 30,
        },
        legend: {
          show: false,
          data: ['数量'],
        },
        xAxis: [
          {
            type: 'category',
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        dataZoom: [
          {
            type: 'inside',
          },
        ],
        series: [
          {
            data: [],
            name: '数量',
            type: 'line',
            itemStyle: {
              borderColor: '#e8984d',
              borderWidth: 2,
            },
            lineStyle: {
              color: '#4da3c0',
              width: 3,
            },
            symbol: 'emptyCircle',
            symbolSize: 10,
            smooth: true,
          },
        ],
      },
      // 在线人数
      onlineDoctorCount: 0,
    };
  },

  computed: {
    // 根据选择的时间类型计算显示的时间范围
    dateRange() {
      const date = {};
      if (this.dateRangeType === 'week') {
        date.startDate = moment().startOf('week').add(1, 'days').format('YYYY/M/D');
        date.endDate = moment().endOf('week').add(1, 'days').format('YYYY/M/D');
      } else if (this.dateRangeType === 'month') {
        date.startDate = moment().startOf('month').format('YYYY/M/D');
        date.endDate = moment().endOf('month').format('YYYY/M/D');
      } else if (this.dateRangeType === 'date') {
        date.startDate = moment(this.datePickerRange[0]).format('YYYY/M/D');
        date.endDate = moment(this.datePickerRange[1]).format('YYYY/M/D');
      }
      return date;
    },
  },

  watch: {
    // 监视精确查找内容变化
    searchValue(newVal) {
      clearTimeout(this.searchValueTimer);
      this.searchValueTimer = setTimeout(() => {
        // 请求数据
        this[this.areaArgument.type + 'RequestData']();
      }, 200);
    },
  },

  methods: {
    // 查找范围选择全部
    handleSelectRange() {
      this.searchValue = '';
    },
    // 选择查找的时间范围类型
    handleDateRangeType(range) {
      // 阻止重复点击请求
      if (this.dateRangeType === 'week' || this.dateRangeType === 'month') {
        if (this.dateRangeType === range) {
          return;
        }
      }
      this.dateRangeType = range;
      if (range !== 'date') {
        this.datePickerRange = [];
      }
      // 请求数据
      this[this.areaArgument.type + 'RequestData']();
    },
    // 算出前一周或前一个月时间范围
    computeDateRange() {
      const compareDate = {};
      if (this.dateRangeType === 'week') {
        compareDate.startDate = moment().startOf('week').subtract(6, 'days').format('YYYY-M-D');
        compareDate.endDate = moment().endOf('week').subtract(6, 'days').format('YYYY-M-D');
      } else if (this.dateRangeType === 'month') {
        compareDate.startDate = moment().subtract(1, 'months').startOf('month').format('YYYY-M-D');
        compareDate.endDate = moment().subtract(1, 'months').endOf('month').format('YYYY-M-D');
      }
      return compareDate;
    },
    // 计算得出上下浮动百分比数值
    computeFloatation(showCount, prevCount) {
      if (showCount === 0) {
        this.floatationIcon = '';
        this.floatation = '';
        return;
      }
      const patientFloatation = Number((((showCount - prevCount) / showCount) * 100).toFixed(2));
      if (patientFloatation > 0) {
        this.floatationIcon = 'up';
        this.floatation = patientFloatation + '%';
      } else if (patientFloatation < 0) {
        this.floatationIcon = 'down';
        this.floatation = -patientFloatation + '%';
      } else if (patientFloatation === 0) {
        this.floatationIcon = '';
        this.floatation = '';
      }
    },
    // 生成折线图
    createLineChart(distribution) {
      this.myOption.xAxis[0].data = distribution.map((item) => moment(item.k).format('M/D'));
      this.myOption.series[0].data = distribution.map((item) => item.v);
      this.myChart.setOption(this.myOption);
    },
    // 注册用户模块请求数据
    registerRequestData() {
      this.registerOrActiveRequestData(true);
    },
    // 活跃用户模块请求数据
    activeRequestData() {
      this.registerOrActiveRequestData(false);
      this.requestOnlineDoctorCount();
    },
    // 注册用户和活跃用户模块请求及数据处理
    async registerOrActiveRequestData(isRegister) {
      this.$emit('requestHospitalList', {
        register_or_active: isRegister,
        day_start: this.dateRange.startDate,
        day_end: this.dateRange.endDate,
      });
      const showCount = await this.requestCount_1(this.dateRange.startDate, this.dateRange.endDate, isRegister);
      this.showCount = showCount;
      const distribution = await this.requestDistribution_1(
        this.dateRange.startDate,
        this.dateRange.endDate,
        isRegister,
      );
      // 折线图数据处理
      this.createLineChart(distribution);
      if (this.dateRangeType !== 'date') {
        // 如果是选择时间范围是周或者月，算出数量上升或下降幅度百分比
        const prevDateRange = this.computeDateRange();
        const prevCount = await this.requestCount_1(prevDateRange.startDate, prevDateRange.endDate, isRegister);
        this.computeFloatation(showCount, prevCount);
      } else {
        this.floatationIcon = '';
        this.floatation = '';
      }
    },
    // 注册用户和活跃用户模块数量请求
    async requestCount_1(startDate, endDate, isRegister) {
      const variables = {
        register_or_active: isRegister,
        day_start: startDate,
        day_end: endDate,
      };
      if (this.searchValue !== '') {
        variables.hospital = this.searchValue;
      }
      try {
        const res = await this.$apollo.query({
          query: gql`query(
            $register_or_active: Boolean = true,
            $day_start: String,
            $day_end: String,
            $hospital: String
          ){
            adminStatistics{
              doctor_count(
                register_or_active: $register_or_active,
                day_start: $day_start,
                day_end: $day_end,
                hospital: $hospital
              )
            }
          }`,
          variables,
        });
        return res.data.adminStatistics.doctor_count;
      } catch (error) {
        this.$message.error(error.message.split(':')[1]);
      }
    },
    // 注册用户和活跃用户模块数量分布请求
    async requestDistribution_1(startDate, endDate, isRegister) {
      try {
        const res = await this.$apollo.query({
          query: gql`query(
            $register_or_active: Boolean = true,
            $day_start: String,
            $day_end: String,
            $group_by: TimeFrame
          ){
            adminStatistics{
              doctor_distribution(
                register_or_active: $register_or_active,
                day_start: $day_start,
                day_end: $day_end,
                group_by: $group_by
              ){
                k
                v
              }
            }
          }`,
          variables: {
            register_or_active: isRegister,
            day_start: startDate,
            day_end: endDate,
            group_by: 'date',
          },
        });
        return res.data.adminStatistics.doctor_distribution;
      } catch (error) {
        this.$message.error(error.message.split(':')[1]);
      }
    },
    // 诊断模块请求数据
    diagnosisRequestData() {
      this.threeTypesRequestData('diagnosis');
    },
    // 患者模块请求数据
    patientRequestData() {
      this.threeTypesRequestData('patient');
    },
    // 影像模块请求数据
    imagesRequestData() {
      this.threeTypesRequestData('image');
    },
    // 诊断、患者和影像模块请求及数据处理
    async threeTypesRequestData(type) {
      const showCount = await this.requestCount_2(this.dateRange.startDate, this.dateRange.endDate, type);
      this.showCount = showCount;
      const distribution = await this.requestDistribution_2(this.dateRange.startDate, this.dateRange.endDate, type);
      // 折线图数据处理
      this.createLineChart(distribution);
      if (this.dateRangeType !== 'date') {
        // 如果是选择时间范围是周或者月，算出数量上升或下降幅度百分比
        const prevDateRange = this.computeDateRange();
        const prevCount = await this.requestCount_2(prevDateRange.startDate, prevDateRange.endDate, type);
        this.computeFloatation(showCount, prevCount);
      } else {
        this.floatationIcon = '';
        this.floatation = '';
      }
    },
    // 诊断模块数量请求
    async requestCount_2(startDate, endDate, type) {
      const variables = {
        day_start: startDate,
        day_end: endDate,
      };
      if (this.searchValue !== '') {
        variables.hospital = this.searchValue;
      }
      try {
        const res = await this.$apollo.query({
          query: gql`query($day_start: String, $day_end: String, $hospital: String){
            adminStatistics{
              ${type}_count(day_start: $day_start, day_end: $day_end, hospital: $hospital)
            }
          }`,
          variables,
        });
        return res.data.adminStatistics[type + '_count'];
      } catch (error) {
        this.$message.error(error.message.split(':')[1]);
      }
    },
    // 诊断模块数量分布请求
    async requestDistribution_2(startDate, endDate, type) {
      const variables = {
        day_start: startDate,
        day_end: endDate,
        group_by: 'date',
      };
      if (this.searchValue !== '') {
        variables.hospital = this.searchValue;
      }
      try {
        const res = await this.$apollo.query({
          query: gql`query($day_start: String, $day_end: String, $hospital: String, $group_by: TimeFrame!){
            adminStatistics{
              ${type}_distribution(day_start: $day_start, day_end: $day_end, hospital: $hospital, group_by: $group_by){
                k
                v
              }
            }
          }`,
          variables,
        });
        return res.data.adminStatistics[type + '_distribution'];
      } catch (error) {
        this.$message.error(error.message.split(':')[1]);
      }
    },
    // 查在线人数
    async requestOnlineDoctorCount() {
      try {
        const res = await this.$apollo.query({
          query: gql`{
            adminStatistics{
              online_doctor_count
            }
          }`,
          fetchPolicy: 'no-cache',
        });
        this.onlineDoctorCount = res.data.adminStatistics.online_doctor_count;
      } catch (error) {
        this.$message.error(error.message.split(':')[1]);
      }
    },
  },

  mounted() {
    this.myChart = echarts.init(this.$refs.myChart);
    // 请求数据
    this[this.areaArgument.type + 'RequestData']();
  },

  filters: {
    numberFormat: (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
};
</script>

<style lang="less">
@import "../assets/style/style.less";

.unified-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top-head-wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 92px;
    .border();
    padding: 0 10px;
    border-radius: 10px;
    .pic{
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 76px;
      height: 76px;
      color: #fff;
      margin-right: 10px;
      border-radius: 10px;
      user-select: none;
      .shadow();
      font-size: 46px;
      .message-alert{
        position: absolute;
        right: 12px;
        bottom: 12px;
        width: 14px;
        height: 14px;
        background-color: #29af1d;
        border: 1px solid #1f8218;
        border-radius: 50%;
      }
    }
    .pic.from-top{
      background-color: @yColor;
    }
    .pic.from-bottom{
      background-color: @bColor;
    }
    .content{
      flex: 1;
      height: 74px;
      .hospital-search{
        height: 26px;
        display: flex;
        align-items: center;
        .all-btn{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30%;
          height: 100%;
          .border();
          color: #ccc;
          margin-right: 5px;
          background-color: #fff;
          box-sizing: border-box;
          text-align: center;
          border-radius: 5px;
          font-size: 13px;
          .pointer()
        }
        .all-btn.from-top.active{
          color: #fff;
          background-color: @yColor;
        }
        .all-btn.from-bottom.active{
          color: #fff;
          background-color: @bColor;
        }
        .input-wrap{
          position: relative;
          flex: 1;
          height: 100%;
          .search-input{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            .border();
            color: #999;
            padding-left: 26px;
            padding-right: 5px;
            border-radius: 5px;
            font-size: 13px;
            font-weight: bold;
            outline: none;
          }
          .search-input.from-top.active{
            border-color: @yColor;
          }
          .search-input.from-bottom.active{
            border-color: @bColor;
          }
          .icon-search{
            position: absolute;
            left: 5px;
            top: 5px;
            color: #ddd;
          }
        }
      }
      .sum-wrap{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 40px;
        margin-top: 5px;
        .left-box{
          display: flex;
          align-items: flex-end;
          height: 100%;
        }
        .right-box{
          display: flex;
          align-items: flex-end;
          height: 100%;
          margin-right: 20px;
        }
        .sum-label{
          padding-bottom: 5px;
          padding-left: 5px;
          font-size: 12px;
          font-weight: bold;
        }
        .sum-number{
          margin-left: 20px;
          font-size: 26px;
          font-weight: bold;
        }
        .sum-number.from-top{
          color: @yColor;
        }
        .sum-number.from-bottom{
          color: @bColor;
        }
      }
    }
  }
  .top-head-wrap.from-top{
    background-color: @bgColor;
  }
  .top-head-wrap.from-bottom{
    background-color: #fff;
  }
  .tab-wrap{
    display: flex;
    height: 32px;
    .btn-wrap{
      display: flex;
      overflow: hidden;
      width: 36%;
      height: 100%;
      margin-right: 5px;
      .border();
      box-sizing: border-box;
      border-radius: 5px;
      .btn{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 100%;
        color: #999;
        box-sizing: border-box;
        background-color: #fff;
        font-size: 14px;
        .pointer();
      }
      .btn + .btn{
        border-left: 1px solid #cfcfcf;
      }
      .btn.from-top.active{
        color: #fff;
        background-color: @yColor;
      }
      .btn.from-bottom.active{
        color: #fff;
        background-color: @bColor;
      }
    }
    .date-picker{
      color: #999;
    }
    .date-picker.from-top.active{
      color: #fff;
      background-color: @yColor;
    }
    .date-picker.from-bottom.active{
      color: #fff;
      background-color: @bColor;
    }
  }
  .number-info-wrap{
    display: flex;
    justify-content: flex-end;
    position: relative;
    overflow: hidden;
    height: 82px;
    .border();
    border-radius: 10px;
    background-color: #fff;
    .icon{
      color: #ececec;
    }
    .icon-1 {
      width: 136px;
      font-size: 132px;
      line-height: 106px;
    }
    .icon-2{
      width: 126px;
      font-size: 138px;
      line-height: 108px;
    }
    .icon-3{
      width: 136px;
      font-size: 148px;
      line-height: 124px;
    }
    .content-wrap{
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      padding: 8px 15px;
      .title-wrap{
        display: flex;
        align-items: flex-end;
        .label{
          font-size: 12px;
          font-weight: bold;
        }
        .date{
          color: #999;
          margin-left: 15px;
          font-size: 12px;
        }
      }
      .info-wrap{
        display: flex;
        align-items: flex-end;
        padding-top: 12px;
        padding-left: 10px;
        .num{
          color: #c0c0c0;
          font-size: 26px;
          font-weight: bold;
        }
        .floating{
          display: flex;
          align-items: center;
          margin-left: 15px;
          padding-bottom: 5px;
          font-weight: bolder;
          .floating-num{
            margin-left: 5px;
            padding-bottom: 2px;
            font-weight: bolder;
            font-size: 12px;
          }
          .icon-up {
            color: #4DA2BE;
            font-weight: bolder;
            font-size: 14px;
          }
          .icon-down {
            color: #b31a10;
            font-weight: bolder;
            font-size: 14px;
          }
          .icon-uniformity{
            color: #888;
            font-weight: bolder;
          }
        }
      }
    }
  }
  .line-chart-wrap{
    position: relative;
    height: 160px;
    .border();
    border-radius: 10px;
    background-color: #fff;
    .echart-wrap{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .title{
      position: absolute;
      left: 15px;
      top: 8px;
      font-size: 12px;
      font-weight: bold;
    }
  }
}
</style>
