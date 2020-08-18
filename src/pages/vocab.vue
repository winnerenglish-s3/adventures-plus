<template>
  <div>
    <!-- top bar -->
    <div class="row bg-blue-8 text-white items-center" style="height: 56px;">
      <div style="width:50px;" align="center">
        <q-icon name="fas fa-arrow-left" @click="backMain()" />
      </div>
      <div class="col" style="font-size: 20px;">คำศัพท์</div>
      <!-- <div style="width:50px" align="center">
        <q-btn round color="brown-9" push icon="fas fa-print" size="12px" @click="print()"></q-btn>
      </div>-->
    </div>
    <!-- title -->
    <div class="text-h6 q-py-md" align="center">{{title}}</div>
    <q-separator />
    <!-- list -->
    <div v-for="(item,index) in vocabList" :key="index">
      <div class="row items-center">
        <div style="width:85px;" v-if="item.isShowImage">
          <q-img :src="item.imgURLData" width="85px" />
        </div>
        <div style="width:85px;" align="center" v-if="!item.isShowImage">
          <q-img src="../../public/pictures/noimage.jpg" width="85px" />
        </div>
        <div class="col q-pl-md">
          <div>{{item.vocabulary}} ({{item.partOfSpeech}})</div>
          <div v-html="item.pronounce" style="font-size:14px;" class="text-grey-8"></div>
          <div v-html="item.meaning"></div>
        </div>
      </div>

      <q-separator />
    </div>
  </div>
</template>

<script>
import { db, st } from "../router";
export default {
  data() {
    return {
      level: this.$route.params.lv,
      unit: this.$route.params.unit,
      title: "",
      vocabList: [],
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
        .where("skill", "==", "Vocabulary")
        .get()
        .then((doc) => {
          this.title = doc.docs[0].data().name;
        });
    },
    loadVocab() {
      db.collection("practicelist")
        .where("practicetype", "==", "flashcard")
        .where("level", "==", this.level)
        .where("unit", "==", this.unit)
        .get()
        .then((doc) => {
          doc.forEach((data) => {
            db.collection("practicepool_server")
              .where("practicekey", "==", data.id)
              .get()
              .then((doc2) => {
                doc2.forEach((data2) => {
                  let serverURL =
                    "https://storage.googleapis.com/winnerenglish/upload/";
                  let final = {
                    imgURLData:
                      serverURL +
                      "pic_flashcard/" +
                      data2.id.toLowerCase() +
                      ".jpg",
                    partOfSpeech: data2.data().partOfSpeech,
                    vocabulary: data2.data().vocabulary,
                    isShowImage: data2.data().isShowImage,
                    pronounce: data2.data().pronounce,
                    meaning: data2.data().meaning,
                  };

                  this.vocabList.push(final);
                });
                this.vocabList.sort((a, b) => a.order - b.order);
              });
          });
        });
    },
    print() {
      this.$router.push({
        name: "vocabprint",
        params: {
          level: this.level,
          unit: this.unit,
          title: this.title,
          vocabList: this.vocabList,
        },
      });
    },
  },
  mounted() {
    if (this.$q.localStorage.getItem("lv") == null) {
      this.$router.push("/");
    }
    this.loadTitle();
    this.loadVocab();
  },
};
</script>

<style scoped>
</style>