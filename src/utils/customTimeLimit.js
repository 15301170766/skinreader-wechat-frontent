export default {

  data() {
    return {
      isShowCustomTimeLimit: false,
    };
  },

  methods: {
    closeCustomTimeLimit() {
      this.ruleForm.modifyTimeLimit = '';
      this.isShowCustomTimeLimit = false;
    },
    confirmCustomTimeLimit(customTimeLimit) {
      if (!customTimeLimit) {
        return;
      }
      this.handleTimeLimitOption(customTimeLimit);
      this.ruleForm.modifyTimeLimit = customTimeLimit;
      this.isShowCustomTimeLimit = false;
    },
    handleTimeLimitOption(customTimeLimit) {
      if (customTimeLimit !== '24' && customTimeLimit !== '72' && customTimeLimit !== '168' && customTimeLimit !== '720') {
        if (this.modifyTimeLimitOption.length === 5) {
          this.modifyTimeLimitOption.splice(4, 0, {
            label: customTimeLimit + 'hr',
            value: customTimeLimit + '',
          });
        } else {
          this.modifyTimeLimitOption.splice(4, 1, {
            label: customTimeLimit + 'hr',
            value: customTimeLimit + '',
          });
        }
      }
    },
  },
}
