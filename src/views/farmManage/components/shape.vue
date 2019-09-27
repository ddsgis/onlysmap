<template>
  <div class="shape">
    <h1>Upload Shapefiles</h1>
    <p>Shapefiles are computer files that contain the boundaries of your fields. You can upload them here to import your field boundaries into FarmLogs.</p>
    <div class="content">
      <div class="step">
        <h2 data-step-num="1">Request your shapefiles from the FSA</h2>
        <p>If you already have your shapefiles, skip to the next step.</p>
      </div>
      <div class="step">
        <h2 data-step-num="2">Create a .zip of your shapefiles</h2>
        <p>Follow these instructions to create a zip file that you can upload on this page.</p>
        <p>Your zip file must have at least one of each of the following:</p>
        <ul>
          <li>A .shp shapefile</li>
          <li>A .shx index file</li>
          <li>A .dbf database file</li>
          <li>A .prj projection file (if available)</li>
        </ul>
        <p>Instead of a .zip of files from the FSA, .kml data files may also be uploaded.</p>
      </div>
      <div class="step">
        <h2 data-step-num="3">Upload your zip file</h2>
        <el-upload
          :file-list="fileList"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过30mb</div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: []
    };
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
  .shape {
    margin-left: 100px;
    h1 {
      color: #5c6370;
    }
    p {
      line-height: 1.7;
    }
    .step {
      margin-bottom: 30px;
    }
    h2 {
      position: relative;
      color: #5c6370;
    }
    h2::after {
      display: block;
      position: absolute;
      content: attr(data-step-num);
      width: 26px;
      height: 26px;
      line-height: 26px;
      border-radius: 100px;
      font-weight: 500;
      background-color: #737b8c;
      color: #ffffff;
      text-align: center;
      font-size: 18px;
      top: 2px;
      left: -40px;
    }
  }
</style>
