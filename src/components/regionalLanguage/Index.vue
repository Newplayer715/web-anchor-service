<template>
  <div class="regionalLanguage">
    <div class="translateData" v-for="(item, key) in regions" :key="key">
      <div class="translateTop">
        <div
          class="translateLogo"
          :style="{
            backgroundImage: 'url(' + item.country_icon.url_3x + ')',
          }"
        ></div>
        <div class="translateName">{{ item.country_name }}</div>
      </div>
      <div class="translateLanguage">
        <div
          class="LanguageName"
          v-for="lang in item.language"
          :key="lang.language_id"
        >
          <div
            class="Name"
            @click="changeLanguage(lang, item)"
            :class="{
              active:
                item.country_id === country_id &&
                lang.language_id === language_id,
            }"
          >
            {{ lang.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "regionalLanguage",
  data() {
    return {
      country_id: 4,
      language_id: 3,
      languageAbbreviation:'',
      regions: [
        {
          country_id: 2,
          country_name: "中國香港",
          country_identifier: "Hong Kong",
          country_icon: {
            url: "http://8.134.152.205:8004/files/region_flags/icon-flag-hk.png",
            url_2x:
              "http://8.134.152.205:8004/files/region_flags/icon-flag-hk@2x.png",
            url_3x:
              "http://8.134.152.205:8004/files/region_flags/icon-flag-hk@3x.png",
          },
          country_area_code: "852",
          language: [
            {
              language_id: 2,
              name: "繁体中文",
              abbreviation: "zh_hk",
            },
          ],
        },
        {
          country_id: 4,
          country_name: "Malaysia",
          country_identifier: "Malaysia",
          country_icon: {
            url: "http://8.134.152.205:8004/files/region_flags/icon-flag-Malaysia.png",
            url_2x:
              "http://8.134.152.205:8004/files/region_flags/icon-flag-Malaysia@2x.png",
            url_3x:
              "http://8.134.152.205:8004/files/region_flags/icon-flag-Malaysia@3x.png",
          },
          country_area_code: "60",
          language: [
            {
              language_id: 3,
              name: "English",
              abbreviation: "en",
            },
            {
              language_id: 1,
              name: "简体中文",
              abbreviation: "zh_cn",
            },
            {
              language_id: 5,
              name: "Melayu",
              abbreviation: "ms",
            },
          ],
        },
        {
          country_id: 3,
          country_name: "Việt Nam",
          country_identifier: "Vietnam",
          country_icon: {
            url: "http://8.134.152.205:8004/files/region_flags/icon-flag-vietnam.png",
            url_2x:
              "http://8.134.152.205:8004/files/region_flags/icon-flag-vietnam@2x.png",
            url_3x:
              "http://8.134.152.205:8004/files/region_flags/icon-flag-vietnam@3x.png",
          },
          country_area_code: "84",
          language: [
            {
              language_id: 4,
              name: "Tiếng Việt",
              abbreviation: "vi",
            },
          ],
        },
      ], //地区和语言
    };
  },
  mounted(){
    if(localStorage.getItem("country_id")){
      this.country_id = Number(localStorage.getItem("country_id"))
      this.language_id = Number(localStorage.getItem("language_id"))
      this.languageAbbreviation = (localStorage.getItem("languageAbbreviation"))
    }
    this.loadTranslation()
  },
  methods: {
    // 切换语言
    changeLanguage(index, regions) {
      // console.log(index,regions);
      this.country_id = regions.country_id;
      this.language_id = index.language_id;
      this.languageAbbreviation = index.abbreviation;
      this.$emit("changeData", regions, index.name);

      // 存储地区id
      localStorage.setItem("country_id",  this.country_id);
      // 存储语言
      localStorage.setItem("language_id",  this.language_id);
      localStorage.setItem("languageAbbreviation", this.languageAbbreviation);
      this.loadTranslation()
    },
    // 翻译
    loadTranslation() {
      try {
        // console.log(this.languageAbbreviation);
        const translations = require("@/locales/" +
          this.languageAbbreviation +
          ".js").default;
        // 更新翻译配置
        // 更新 VueI18n 实例的翻译配置
        this.$i18n.locale = this.languageAbbreviation;
        
        this.$i18n.setLocaleMessage("en", translations);
        // console.log(translations);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../regionalLanguage/Index.scss";
</style>
