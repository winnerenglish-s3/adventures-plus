<template>
  <div>
    <div class="row bg-blue-8 text-white items-center" style="height: 56px;">
      <div style="width:50px;" align="center">
        <q-icon name="fas fa-arrow-left" @click="backMain()" />
      </div>
      <div class="col" style="font-size: 20px;">การออกเสียง</div>
      <!-- <div style="width:50px" align="center">
        <q-btn round color="brown-9" push icon="fas fa-print" size="12px"></q-btn>
      </div>-->
    </div>
    <!-- title -->
    <div class="text-h6 q-py-md q-px-sm" align="center">{{title}}</div>
    <q-separator />
    <!-- list -->
    <div v-for="(item,index) in slideList" :key="index">
      <div class="text-body2 q-py-sm q-px-sm">{{item.slideName}}</div>
      <div style="width:100%">
        <q-img :src="item.imgUrl" />
      </div>
      <div style="height:10px; width:100%" class="bg-grey-5 q-mt-sm"></div>
    </div>
  </div>
</template>

<script>
import { db, st } from "../router";
export default {
  data() {
    return {
      title: "",
      level: this.$route.params.lv,
      unit: this.$route.params.unit,
      slideList: [],
    };
  },
  methods: {
    backMain() {
      this.$router.push("/main");
    },
    loadTitle() {
      db.collection("practiceListName")
        .where("level", "==", this.level)
        .where("unit", "==", this.unit)
        .where("skill", "==", "Phonics")
        .get()
        .then((doc) => {
          this.title = doc.docs[0].data().name;
        });
    },
    loadPhonics() {
      db.collection("practicelist")
        .where("practicetype", "==", "phonicslesson")
        .where("level", "==", this.level)
        .where("unit", "==", this.unit)
        .get()
        .then((doc) => {
          let listData = [];
          doc.forEach((data) => {
            let temp = {
              id: data.id,
              order: data.data().order,
            };
            listData.push(temp);
          });
          listData.sort((a, b) => a.order - b.order);
          listData.forEach((practice) => {
            db.collection("practicepool_server")
              .where("practicekey", "==", practice.id)
              .get()
              .then((doc2) => {
                let slideDataTemp = [];
                doc2.forEach((data2) => {
                  let temp2 = {
                    imgUrl: data2.data().imgURL,
                    slideName: data2.data().topic,
                    order: data2.data().order,
                  };

                  slideDataTemp.push(temp2);
                });
                slideDataTemp.sort((a, b) => a.order - b.order);
                slideDataTemp.forEach((data3) => {
                  this.slideList.push(data3);
                });
              });
          });
        });
    },
  },
  mounted() {
    if (this.$q.localStorage.getItem("lv") == null) {
      this.$router.push("/");
    }
    this.loadTitle();
    this.loadPhonics();
  },
};
</script>

<style scoped>
</style>