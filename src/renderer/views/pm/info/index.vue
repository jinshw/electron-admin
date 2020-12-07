<template>
  <div>
    <!-- <h1 class="d2-mt-0">项目基本信息</h1> -->
    <div>
      <div id="top">
        <el-row>
          <el-form :inline="true">
            <el-form-item label="项目名称">
              <el-input v-model.trim="searchText" type="text" placeholder="项目名称" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="filters.options.isDeleteOptions.value" placeholder="请选择">
                <el-option
                  v-for="item in filters.options.isDeleteOptions.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="addClick">新增</el-button>
            <el-button type="primary" @click="getExportPropList">导出Excel</el-button>
          </el-form>
        </el-row>

      </div>

      <div style="margin-top:15px">
        <el-table
          ref="testTable"
          :data="tableData"
          style="width:100%"
          border
        >
          <el-table-column
            prop="projectname"
            label="项目名称"
            sortable
            show-overflow-tooltip
          />

          <!-- <el-table-column
            prop="projectcode"
            label="项目编码"
          /> -->

          <el-table-column
            prop="roadcode"
            label="路线编号"
          />
          <el-table-column
            prop="isDelete"
            label="状态"
            :formatter="formatOptions"
            sortable
          />

          <el-table-column
            prop="createTime"
            label="更新时间"
            :formatter="formatDate"
            sortable
          />

          <el-table-column
            prop="sysUser.username"
            label="操作人"
          />
          <!-- <el-table-column
            prop="isDelete"
            label="是否已删除"
            sortable
          /> -->

          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleShow(scope.$index, scope.row)"
              >查看</el-button>
              <el-button
                v-if="scope.row.isDelete===0"
                size="small"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                v-if="scope.row.isDelete===0"
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
              <el-button
                v-if="scope.row.isDelete===1"
                size="small"
                type="danger"
                @click="handleRestore(scope.$index, scope.row)"
              >解禁</el-button>
            </template>

          </el-table-column>
        </el-table>

        <div align="center">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <el-dialog
        :title="dialogTitle"
        fullscreen
        :visible.sync="addDialogVisible"
        width="90%"
        center
        @close="addDialogClose"
      >
        <el-tabs v-model="addTabsActiveName" @tab-click="handleAddTabsClick">
          <el-tab-pane label="基本信息" name="baseInfo">
            <div>
              <el-form ref="projectInfoForm" :model="projectInfo" :rules="projectInfoRules" :inline="true" :disabled="isShow">
                <el-form-item label="项目编号" prop="projectcode" required>
                  <el-input v-model="projectInfo.projectcode" :disabled="submitType === 2" placeholder="项目编号" />
                </el-form-item>
                <el-form-item label="项目名称" prop="projectname" required>
                  <el-input v-model="projectInfo.projectname" placeholder="项目名称" />
                </el-form-item>
                <el-form-item label="路线编号" prop="roadcode" required>
                  <el-input v-model="projectInfo.roadcode" placeholder="路线编号" />
                </el-form-item>
                <el-form-item label="项目所在文件夹名称(唯一值)" prop="roadcode" required>
                  <el-input v-model="projectInfo.projectFolder" placeholder="项目所在文件夹名称" style="width:500px;" />
                </el-form-item>
                <el-divider content-position="center">规划属性</el-divider>
                <el-form-item label="国道">
                  <el-select v-model="options.nationalroadOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.nationalroadOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="省道">
                  <el-select v-model="options.provinceroadOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.provinceroadOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="农村公路">
                  <el-select v-model="options.ruralroadOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.ruralroadOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="规划时序">
                  <el-select v-model="options.planseqOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.planseqOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="规划等级">
                  <el-select v-model="options.planlevelOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.planlevelOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="收费">
                  <el-select v-model="options.feeOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.feeOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="非收费">
                  <el-select v-model="options.notfeeOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.notfeeOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-divider content-position="center">其他</el-divider>
                <el-form-item label="建设性质(新建)">
                  <el-input v-model="projectInfo.constructionNew" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                </el-form-item>
                <el-form-item label="另辟新线改建">
                  <el-input v-model="projectInfo.constructionModify" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                </el-form-item>
                <el-form-item label="原路扩容改建">
                  <el-input v-model="projectInfo.constructionExtend" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                </el-form-item>
                <el-form-item label="主线总里程">
                  <el-input v-model="projectInfo.mainMileage" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                </el-form-item>
                <el-form-item label="连接线总里程">
                  <el-input v-model="projectInfo.connectMileage" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                </el-form-item>
                <el-form-item label="总投资">
                  <el-input v-model="projectInfo.investmentAll" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                </el-form-item>
                <el-form-item label="线位研究计划开展时间">
                  <el-date-picker v-model="projectInfo.lineResearchPlanstartdate" type="month" placeholder="选择月" />
                </el-form-item>
                <el-form-item label="工可计划开展时间">
                  <el-date-picker v-model="projectInfo.workPlanstartdate" type="month" placeholder="选择月" />
                </el-form-item>
                <el-form-item label="初步设计计划开展时间">
                  <el-date-picker v-model="projectInfo.initialDesignPlanstartdate" type="month" placeholder="选择月" />
                </el-form-item>
                <el-form-item label="拟定开工年">
                  <el-date-picker v-model="projectInfo.planStartworkYear" type="year" placeholder="选择年" />
                </el-form-item>
                <el-form-item label="拟定完工年">
                  <el-date-picker v-model="projectInfo.planEndworkYear" type="year" placeholder="选择年" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :disabled="isShow">
                <el-form-item label="建设必要性">
                  <el-input
                    v-model="projectInfo.needReason"
                    type="textarea"
                    :rows="2"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    class="textarea-class"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :disabled="isShow">
                <el-form-item label="城镇开发边界">
                  <el-select v-model="options.townBoundaryOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.townBoundaryOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="城镇开发边界问题">
                  <el-input
                    v-model="projectInfo.townBoundaryProblem"
                    type="textarea"
                    :rows="2"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    class="textarea-class"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :disabled="isShow">
                <el-form-item label="永久基本农田">
                  <el-select v-model="options.baseFarmlandOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.baseFarmlandOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="永久基本农田问题">
                  <el-input
                    v-model="projectInfo.baseFarmlandProblem"
                    type="textarea"
                    :rows="2"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    class="textarea-class"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :disabled="isShow">
                <el-form-item label="生态保护红线">
                  <el-select v-model="options.environmentRedlineOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.environmentRedlineOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="生态保护红线问题">
                  <el-input
                    v-model="projectInfo.environmentRedlineProblem"
                    type="textarea"
                    :rows="2"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    class="textarea-class"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :disabled="isShow">
                <el-form-item label="军事敏感区">
                  <el-select v-model="options.militaryAreaOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.militaryAreaOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="军事敏感区问题">
                  <el-input
                    v-model="projectInfo.militaryAreaProblem"
                    type="textarea"
                    :rows="2"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    class="textarea-class"
                  />
                </el-form-item>
                <br>
                <el-form-item label="通道类型">
                  <el-select v-model="options.channelTypeOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.channelTypeOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="环起来">
                  <el-select v-model="options.encircleTypeOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.encircleTypeOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>

              <el-collapse v-model="collapseActiveNames">
                <el-collapse-item title="当前公路等级" name="1">
                  <el-form :inline="true" :disabled="isShow">
                    <!-- <el-divider content-position="center">公路等级</el-divider> -->
                    <el-form-item label="高速整体式4车道(km)">
                      <el-input v-model="currentHighwayLevel.gsOverall4" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速整体式6车道(km)">
                      <el-input v-model="currentHighwayLevel.gsOverall6" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速整体式8车道(km)">
                      <el-input v-model="currentHighwayLevel.gsOverall8" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速分离式4车道(km)">
                      <el-input v-model="currentHighwayLevel.gsDisconnect4" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速分离式6车道(km)">
                      <el-input v-model="currentHighwayLevel.gsDisconnect6" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速分离式8车道(km)">
                      <el-input v-model="currentHighwayLevel.gsDisconnect8" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速设计时速120(km/h)">
                      <el-input v-model="currentHighwayLevel.gsDesignSpeed120" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速设计时速100(km/h)">
                      <el-input v-model="currentHighwayLevel.gsDesignSpeed100" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速设计时速80(km/h)">
                      <el-input v-model="currentHighwayLevel.gsDesignSpeed80" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="一级整体式4车道(km)">
                      <el-input v-model="currentHighwayLevel.oneOverall4" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级整体式6车道(km)">
                      <el-input v-model="currentHighwayLevel.oneOverall6" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级整体式8车道(km)">
                      <el-input v-model="currentHighwayLevel.oneOverall8" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级分离式式4车道(km)">
                      <el-input v-model="currentHighwayLevel.oneDisconnect4" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级分离式式6车道(km)">
                      <el-input v-model="currentHighwayLevel.oneDisconnect6" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级分离式式8车道(km)">
                      <el-input v-model="currentHighwayLevel.oneDisconnect8" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级设计时速100(km/h)">
                      <el-input v-model="currentHighwayLevel.oneDesignSpeed100" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级设计时速80(km/h)">
                      <el-input v-model="currentHighwayLevel.oneDesignSpeed80" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级设计时速60(km/h)">
                      <el-input v-model="currentHighwayLevel.oneDesignSpeed60" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="二级路基宽度1(m)">
                      <el-input v-model="currentHighwayLevel.twoRoadbedWidth1" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度1里程长度(km)">
                      <el-input v-model="currentHighwayLevel.twoRoadbedWidth1len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度2(m)">
                      <el-input v-model="currentHighwayLevel.twoRoadbedWidth2" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度2里程长度(km)">
                      <el-input v-model="currentHighwayLevel.twoRoadbedWidth2len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度3(m)">
                      <el-input v-model="currentHighwayLevel.twoRoadbedWidth3" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度3里程长度(km)">
                      <el-input v-model="currentHighwayLevel.twoRoadbedWidth3len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级设计时速80(km/h)">
                      <el-input v-model="currentHighwayLevel.twoDesignSpeed80" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级设计时速60(km/h)">
                      <el-input v-model="currentHighwayLevel.twoDesignSpeed60" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级设计时速40(km/h)">
                      <el-input v-model="currentHighwayLevel.twoDesignSpeed40" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="三级路基宽度1(m)">
                      <el-input v-model="currentHighwayLevel.threeRoadbedWidth1" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="三级路基宽度1里程长度(km)">
                      <el-input v-model="currentHighwayLevel.threeRoadbedWidth1len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="三级路基宽度2(m)">
                      <el-input v-model="currentHighwayLevel.threeRoadbedWidth2" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="三级路基宽度2里程长度(km)">
                      <el-input v-model="currentHighwayLevel.threeRoadbedWidth2len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="三级设计时速40(km/h)">
                      <el-input v-model="currentHighwayLevel.threeDesignSpeed40" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="三级设计时速30(km/h)">
                      <el-input v-model="currentHighwayLevel.threeDesignSpeed30" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="四级路基宽度1(m)">
                      <el-input v-model="currentHighwayLevel.fourRoadbedWidth1" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="四级路基宽度1里程长度(km)">
                      <el-input v-model="currentHighwayLevel.fourRoadbedWidth1len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="四级路基宽度2(m)">
                      <el-input v-model="currentHighwayLevel.fourRoadbedWidth2" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="四级路基宽度2里程长度(km)">
                      <el-input v-model="currentHighwayLevel.fourRoadbedWidth2len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="四级设计时速30(km/h)">
                      <el-input v-model="currentHighwayLevel.fourDesignSpeed30" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="四级设计时速20(km/h)">
                      <el-input v-model="currentHighwayLevel.fourDesignSpeed20" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="等外路路基宽度(m)">
                      <el-input v-model="currentHighwayLevel.otherRoadbedWidth" oninput="value=value.replace(/[^\d]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="等外路设计速度(km/h)">
                      <el-input v-model="currentHighwayLevel.otherDesignSpeed" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="等外路里程长度(km)">
                      <el-input v-model="currentHighwayLevel.otherLength" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>

                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="主线建设标准" name="2">
                  <el-form :inline="true" :disabled="isShow">
                    <!-- <el-divider content-position="center">公路等级</el-divider> -->
                    <el-form-item label="高速整体式4车道(km)">
                      <el-input v-model="mainHighWayLevel.gsOverall4" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速整体式6车道(km)">
                      <el-input v-model="mainHighWayLevel.gsOverall6" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速整体式8车道(km)">
                      <el-input v-model="mainHighWayLevel.gsOverall8" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速分离式4车道(km)">
                      <el-input v-model="mainHighWayLevel.gsDisconnect4" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速分离式6车道(km)">
                      <el-input v-model="mainHighWayLevel.gsDisconnect6" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速分离式8车道(km)">
                      <el-input v-model="mainHighWayLevel.gsDisconnect8" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速设计时速120(km/h)">
                      <el-input v-model="mainHighWayLevel.gsDesignSpeed120" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速设计时速100(km/h)">
                      <el-input v-model="mainHighWayLevel.gsDesignSpeed100" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="高速设计时速80(km/h)">
                      <el-input v-model="mainHighWayLevel.gsDesignSpeed80" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="一级整体式4车道(km)">
                      <el-input v-model="mainHighWayLevel.oneOverall4" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级整体式6车道(km)">
                      <el-input v-model="mainHighWayLevel.oneOverall6" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级整体式8车道(km)">
                      <el-input v-model="mainHighWayLevel.oneOverall8" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级分离式式4车道(km)">
                      <el-input v-model="mainHighWayLevel.oneDisconnect4" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级分离式式6车道(km)">
                      <el-input v-model="mainHighWayLevel.oneDisconnect6" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级分离式式8车道(km)">
                      <el-input v-model="mainHighWayLevel.oneDisconnect8" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级设计时速100(km/h)">
                      <el-input v-model="mainHighWayLevel.oneDesignSpeed100" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级设计时速80(km/h)">
                      <el-input v-model="mainHighWayLevel.oneDesignSpeed80" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="一级设计时速60(km/h)">
                      <el-input v-model="mainHighWayLevel.oneDesignSpeed60" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="二级路基宽度1(m)">
                      <el-input v-model="mainHighWayLevel.twoRoadbedWidth1" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度1里程长度(km)">
                      <el-input v-model="mainHighWayLevel.twoRoadbedWidth1len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度2(m)">
                      <el-input v-model="mainHighWayLevel.twoRoadbedWidth2" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度2里程长度(km)">
                      <el-input v-model="mainHighWayLevel.twoRoadbedWidth2len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度3(m)">
                      <el-input v-model="mainHighWayLevel.twoRoadbedWidth3" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="二级路基宽度3里程长度(km)">
                      <el-input v-model="mainHighWayLevel.twoRoadbedWidth3len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级设计时速80(km/h)">
                      <el-input v-model="mainHighWayLevel.twoDesignSpeed80" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级设计时速60(km/h)">
                      <el-input v-model="mainHighWayLevel.twoDesignSpeed60" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="二级设计时速40(km/h)">
                      <el-input v-model="mainHighWayLevel.twoDesignSpeed40" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="三级路基宽度1(m)">
                      <el-input v-model="mainHighWayLevel.threeRoadbedWidth1" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="三级路基宽度1里程长度(km)">
                      <el-input v-model="mainHighWayLevel.threeRoadbedWidth1len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="三级路基宽度2(m)">
                      <el-input v-model="mainHighWayLevel.threeRoadbedWidth2" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="三级路基宽度2里程长度(km)">
                      <el-input v-model="mainHighWayLevel.threeRoadbedWidth2len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="三级设计时速40(km/h)">
                      <el-input v-model="mainHighWayLevel.threeDesignSpeed40" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="三级设计时速30(km/h)">
                      <el-input v-model="mainHighWayLevel.threeDesignSpeed30" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="四级路基宽度1(m)">
                      <el-input v-model="mainHighWayLevel.fourRoadbedWidth1" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="四级路基宽度1里程长度(km)">
                      <el-input v-model="mainHighWayLevel.fourRoadbedWidth1len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="四级路基宽度2(m)">
                      <el-input v-model="mainHighWayLevel.fourRoadbedWidth2" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0000" />
                    </el-form-item>
                    <el-form-item label="四级路基宽度2里程长度(km)">
                      <el-input v-model="mainHighWayLevel.fourRoadbedWidth2len" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="四级设计时速30(km/h)">
                      <el-input v-model="mainHighWayLevel.fourDesignSpeed30" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="四级设计时速20(km/h)">
                      <el-input v-model="mainHighWayLevel.fourDesignSpeed20" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-divider />
                    <el-form-item label="等外路路基宽度(m)">
                      <el-input v-model="mainHighWayLevel.otherRoadbedWidth" oninput="value=value.replace(/[^\d]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="等外路设计速度(km/h)">
                      <el-input v-model="mainHighWayLevel.otherDesignSpeed" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                    <el-form-item label="等外路里程长度(km)">
                      <el-input v-model="mainHighWayLevel.otherLength" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="00.000" />
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>

              <!-- <el-form :inline="true">
                <el-form-item>
                  <el-button @click="addDialogVisible = false">取 消</el-button>
                  <el-button type="primary" :disabled="isShow" @click="addProjectInfo">确 定</el-button>
                </el-form-item>

              </el-form> -->
            </div>

          </el-tab-pane>
          <el-tab-pane label="项目类别" name="projectClass" :disabled="dialogTitle == '新增'">
            <div>
              <el-form :inline="true" :disabled="isShow">
                <el-form-item label="项目类别">
                  <el-select v-model="projectClassOptions.projectClassOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in projectClassOptions.projectClassOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否为GBF公路">
                  <el-select v-model="projectClassOptions.isGbfOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in projectClassOptions.isGbfOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-divider content-position="center">覆盖景区情况</el-divider>
                <el-form-item label="3A景区">
                  <el-input v-model="projectClass.scenic3a" placeholder="3A景区名称" />
                </el-form-item>
                <el-form-item label="4A景区">
                  <el-input v-model="projectClass.scenic4a" placeholder="4A景区名称" />
                </el-form-item>
                <el-form-item label="5A景区">
                  <el-input v-model="projectClass.scenic5a" placeholder="5A景区名称" />
                </el-form-item>

                <el-divider content-position="center">口岸公路</el-divider>
                <el-form-item label="口岸名称">
                  <el-input v-model="projectClass.portName" placeholder="口岸名称" />
                </el-form-item>
                <el-form-item label="口岸等级">
                  <el-select v-model="projectClassOptions.portClassOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in projectClassOptions.portClassOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-divider content-position="center">连接工业园区公路</el-divider>
                <el-form-item label="工业园区名称">
                  <el-input v-model="projectClass.parkName" placeholder="工业园区名称" />
                </el-form-item>
                <el-form-item label="园区等级">
                  <el-select v-model="projectClassOptions.parkClassOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in projectClassOptions.parkClassOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-divider content-position="center">连接物流枢纽中心</el-divider>
                <el-form-item label="物流枢纽名称">
                  <el-input v-model="projectClass.logisticsHubName" placeholder="物流枢纽名称" />
                </el-form-item>
                <el-form-item label="物流枢纽等级">
                  <el-select v-model="projectClassOptions.logisticsClassOptions.value" placeholder="请选择">
                    <el-option
                      v-for="item in projectClassOptions.logisticsClassOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="建设管理" name="pConstruction" :disabled="dialogTitle == '新增'">
            <div>
              <el-form :inline="true" :disabled="isShow">
                <el-divider content-position="center">行政区划</el-divider>
                <el-form-item label="途经地州（市）名称">
                  <el-select
                    v-model="pConstructionOptions.cityCodeOptions.value"
                    placeholder="途经地州（市）"
                    @change="citySelectChange"
                  >
                    <el-option
                      v-for="item in pConstructionOptions.cityCodeOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="途经县">
                  <el-select v-model="pConstructionOptions.countyCodeOptions.value" placeholder="途经县">
                    <el-option
                      v-for="item in pConstructionOptions.countyCodeOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-divider content-position="center">行业主管部门</el-divider>
                <el-form-item label="行业主管部门">
                  <el-input v-model="pConstruction.deptIndustry" placeholder="行业主管部门" />
                </el-form-item>
                <el-form-item label="联系人">
                  <el-input v-model="pConstruction.deptLinkman" placeholder="行业主管部门联系人" />
                </el-form-item>
                <el-form-item label="联系方式">
                  <el-input v-model="pConstruction.deptContact" placeholder="联系方式" />
                </el-form-item>

                <el-divider content-position="center">实施主体</el-divider>
                <el-form-item label="实施主体名称">
                  <el-input v-model="pConstruction.mainName" placeholder="实施主体名称" />
                </el-form-item>
                <el-form-item label="联系人">
                  <el-input v-model="pConstruction.mainLinkman" placeholder="联系人" />
                </el-form-item>
                <el-form-item label="联系方式">
                  <el-input v-model="pConstruction.mainContact" placeholder="联系方式" />
                </el-form-item>

                <el-divider content-position="center">项目法人</el-divider>
                <el-form-item label="项目法人名称">
                  <el-input v-model="pConstruction.legalPerson" placeholder="项目法人名称" />
                </el-form-item>
                <el-form-item label="联系人">
                  <el-input v-model="pConstruction.legalPersonLinkman" placeholder="联系人" />
                </el-form-item>
                <el-form-item label="联系方式">
                  <el-input v-model="pConstruction.legalPersonContact" placeholder="联系方式" />
                </el-form-item>
                <el-form-item label="项目责任人名称">
                  <el-input v-model="pConstruction.pmName" placeholder="项目责任人名称" />
                </el-form-item>
                <el-form-item label="项目责任人联系方式">
                  <el-input v-model="pConstruction.pmContact" placeholder="项目责任人联系方式" />
                </el-form-item>
                <el-divider content-position="center">建设模式</el-divider>
                <el-form-item label="建设模式">
                  <el-select v-model="pConstructionOptions.cpModeOptions.value" placeholder="建设模式">
                    <el-option
                      v-for="item in pConstructionOptions.cpModeOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="前期工作" name="prework" :disabled="dialogTitle == '新增'">
            <div>
              <el-form :inline="true" :disabled="isShow">
                <el-divider content-position="center">预可、项目建议书、线位规划</el-divider>
                <el-form-item label="负责人">
                  <el-input v-model="pPrework.planunitHead" placeholder="负责人" />
                </el-form-item>
                <el-form-item label="联系方式">
                  <el-input v-model="pPrework.planunitContact" placeholder="联系方式" />
                </el-form-item>
                <el-form-item label="单位名称">
                  <el-input v-model="pPrework.planunitUnitname" placeholder="单位名称" />
                </el-form-item>
                <el-form-item label="三区三线">
                  <el-input v-model="pPrework.planout3line" placeholder="三区三线" />
                </el-form-item>
                <el-form-item label="是否规划符合性">
                  <el-select v-model="pPreworkOptions.isPlanoutConformityOptions.value">
                    <el-option
                      v-for="item in pPreworkOptions.isPlanoutConformityOptions.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-divider content-position="center">工可</el-divider>
                <el-form-item label="工可承担单位（负责人）">
                  <el-input v-model="pPrework.workunitHead" placeholder="负责人" />
                </el-form-item>
                <el-form-item label="工可承担单位（联系方式）">
                  <el-input v-model="pPrework.workunitContact" placeholder="联系方式" />
                </el-form-item>
                <el-form-item label="工可承担单位（单位名称）">
                  <el-input v-model="pPrework.workunitUnitname" placeholder="单位名称" />
                </el-form-item>
                <div />
                <el-form-item label="主报告（必要性）">
                  <el-input
                    v-model="pPrework.mainReportNecessity"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
              </el-form>

              <!-- <el-form :inline="true" :disabled="isShow"> -->
              <el-form :inline="true">
                <el-divider content-position="center">项目选址及土地预审</el-divider>
                <el-form-item label="项目选址批复文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[1] != null
                      && pFilesCollectionMap[1]['filesMap'][164] != null"
                    v-model="pFilesCollectionMap[1]['filesMap'][164]['fname']"
                    placeholder="项目选址批复文件"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(1,164)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" :disabled="false" size="small" type="primary" @click="getFileByFcTypeAndPfClass(1,164)">下载</el-button>
                </el-form-item>
                <el-form-item label="土地预审批复部审文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[1] != null
                      && pFilesCollectionMap[1]['filesMap'][165] != null"
                    v-model="pFilesCollectionMap[1]['filesMap'][165]['fname']"
                    placeholder="土地预审批复部审文件"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(1,165)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(1,165)">下载</el-button>
                </el-form-item>
                <el-form-item label="土地预审批复自治区审文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[1] != null
                      && pFilesCollectionMap[1]['filesMap'][166] != null"
                    v-model="pFilesCollectionMap[1]['filesMap'][166]['fname']"
                    placeholder="土地预审批复自治区审文件"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(1,166)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(1,166)">下载</el-button>
                </el-form-item>

                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null"
                    v-model="pFilesCollectionMap[1]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null"
                    v-model="pFilesCollectionMap[1]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="投标基本情况-相关文件扫描件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[2] != null
                      && pFilesCollectionMap[2]['filesMap'][169] != null"
                    v-model="pFilesCollectionMap[2]['filesMap'][169]['fname']"
                    placeholder="投标基本情况-相关文件扫描件"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(2,169)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(2,169)">下载</el-button>
                </el-form-item>

                <el-divider content-position="center">专项-社会稳定风险评估</el-divider>
                <el-form-item label="社会稳定风险评估-评估报告">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[3] != null
                      && pFilesCollectionMap[3]['filesMap'][170] != null"
                    v-model="pFilesCollectionMap[3]['filesMap'][170]['fname']"
                    placeholder="社会稳定风险评估-评估报告"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(3,170)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(3,170)">下载</el-button>
                </el-form-item>
                <el-form-item label="社会稳定风险评估-地方意见">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[3] != null
                      && pFilesCollectionMap[3]['filesMap'][171] != null"
                    v-model="pFilesCollectionMap[3]['filesMap'][171]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(3,171)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(3,171)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[3] != null"
                    v-model="pFilesCollectionMap[3]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[3] != null"
                    v-model="pFilesCollectionMap[3]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">专项-资金方案</el-divider>
                <el-form-item label="资金承诺函">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[4] != null
                      && pFilesCollectionMap[4]['filesMap'][174] != null"
                    v-model="pFilesCollectionMap[4]['filesMap'][174]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(4,174)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(4,174)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[4] != null"
                    v-model="pFilesCollectionMap[4]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[4] != null"
                    v-model="pFilesCollectionMap[4]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">专项-行审意见</el-divider>
                <el-form-item label="专项行审意见-部审意见">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[5] != null
                      && pFilesCollectionMap[5]['filesMap'][177] != null"
                    v-model="pFilesCollectionMap[5]['filesMap'][177]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(5,177)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(5,177)">下载</el-button>
                </el-form-item>
                <el-form-item label="专项行审意见-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[5] != null
                      && pFilesCollectionMap[5]['filesMap'][178] != null"
                    v-model="pFilesCollectionMap[5]['filesMap'][178]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(5,178)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(5,178)">下载</el-button>
                </el-form-item>
                <el-form-item label="专项行审意见-厅审意见">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[5] != null
                      && pFilesCollectionMap[5]['filesMap'][179] != null"
                    v-model="pFilesCollectionMap[5]['filesMap'][179]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(5,179)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(5,179)">下载</el-button>
                </el-form-item>

                <el-divider content-position="center">专项-涉及敏感区</el-divider>
                <el-form-item label="涉及敏感区-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[6] != null
                      && pFilesCollectionMap[6]['filesMap'][180] != null"
                    v-model="pFilesCollectionMap[6]['filesMap'][180]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(6,180)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(6,180)">下载</el-button>
                </el-form-item>
                <el-form-item label="涉及敏感区-批复文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[6] != null
                      && pFilesCollectionMap[6]['filesMap'][181] != null"
                    v-model="pFilesCollectionMap[6]['filesMap'][181]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(6,181)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(6,181)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[6] != null"
                    v-model="pFilesCollectionMap[6]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[6] != null"
                    v-model="pFilesCollectionMap[6]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">专项-自治区政府项目投资评审中心审查</el-divider>
                <el-form-item label="自治区政府项目投资评审中心审查-评估报告">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[7] != null
                      && pFilesCollectionMap[7]['filesMap'][184] != null"
                    v-model="pFilesCollectionMap[7]['filesMap'][184]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(7,184)">点击上传</el-button>
                  </el-upload>
                  <el-button  v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(7,184)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[7] != null"
                    v-model="pFilesCollectionMap[7]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[7] != null"
                    v-model="pFilesCollectionMap[7]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">专项-工可-主报告-附件</el-divider>
                <el-form-item label="需求预测文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[8] != null
                      && pFilesCollectionMap[8]['filesMap'][188] != null"
                    v-model="pFilesCollectionMap[8]['filesMap'][188]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(8,188)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(8,188)">下载</el-button>
                </el-form-item>
                <el-form-item label="交通量文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[9] != null
                      && pFilesCollectionMap[9]['filesMap'][189] != null"
                    v-model="pFilesCollectionMap[9]['filesMap'][189]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(9,189)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(9,189)">下载</el-button>
                </el-form-item>
                <el-form-item label="主要规模及工程量文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[10] != null
                      && pFilesCollectionMap[10]['filesMap'][190] != null"
                    v-model="pFilesCollectionMap[10]['filesMap'][190]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(10,190)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(10,190)">下载</el-button>
                </el-form-item>
                <el-form-item label="技术标准文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[11] != null
                      && pFilesCollectionMap[11]['filesMap'][191] != null"
                    v-model="pFilesCollectionMap[11]['filesMap'][191]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(11,191)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(11,191)">下载</el-button>
                </el-form-item>
                <el-form-item label="投融资初步方案文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[12] != null
                      && pFilesCollectionMap[12]['filesMap'][192] != null"
                    v-model="pFilesCollectionMap[12]['filesMap'][192]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(12,192)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(12,192)">下载</el-button>
                </el-form-item>

                <el-divider content-position="center">工可-行政许可文件-政府投资</el-divider>
                <el-form-item label="政府投资-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[13] != null"
                    v-model="pFilesCollectionMap[13]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="政府投资-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[13] != null"
                    v-model="pFilesCollectionMap[13]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="政府投资-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[13] != null
                      && pFilesCollectionMap[13]['filesMap'][193] != null"
                    v-model="pFilesCollectionMap[13]['filesMap'][193]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(13,193)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(13,193)">下载</el-button>
                </el-form-item>
                <el-form-item label="政府投资-批复文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[13] != null
                      && pFilesCollectionMap[13]['filesMap'][194] != null"
                    v-model="pFilesCollectionMap[13]['filesMap'][194]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(13,194)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(13,194)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[13] != null"
                    v-model="pFilesCollectionMap[13]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[13] != null"
                    v-model="pFilesCollectionMap[13]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">工可-行政许可文件-企业投资</el-divider>
                <el-form-item label="企业投资-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[14] != null"
                    v-model="pFilesCollectionMap[14]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="企业投资-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[14] != null"
                    v-model="pFilesCollectionMap[14]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="企业投资-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[14] != null
                      && pFilesCollectionMap[14]['filesMap'][197] != null"
                    v-model="pFilesCollectionMap[14]['filesMap'][197]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(14,197)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(14,197)">下载</el-button>
                </el-form-item>
                <el-form-item label="企业投资-批复文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[14] != null
                      && pFilesCollectionMap[14]['filesMap'][198] != null"
                    v-model="pFilesCollectionMap[14]['filesMap'][198]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(14,198)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(14,198)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[14] != null"
                    v-model="pFilesCollectionMap[14]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[14] != null"
                    v-model="pFilesCollectionMap[14]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">初步设计-专项-水土保持评价</el-divider>
                <el-form-item label="水土保持评价-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[15] != null"
                    v-model="pFilesCollectionMap[15]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="水土保持评价-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[15] != null"
                    v-model="pFilesCollectionMap[15]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="水土保持评价-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[15] != null
                      && pFilesCollectionMap[15]['filesMap'][204] != null"
                    v-model="pFilesCollectionMap[15]['filesMap'][204]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(15,204)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(15,204)">下载</el-button>
                </el-form-item>
                <el-form-item label="水土保持评价-批复文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[15] != null
                      && pFilesCollectionMap[15]['filesMap'][205] != null"
                    v-model="pFilesCollectionMap[15]['filesMap'][205]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(15,205)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(15,205)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[15] != null"
                    v-model="pFilesCollectionMap[15]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[15] != null"
                    v-model="pFilesCollectionMap[15]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">初步设计-专项-道路安全评价</el-divider>
                <el-form-item label="道路安全评价-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[16] != null"
                    v-model="pFilesCollectionMap[16]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="道路安全评价-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[16] != null"
                    v-model="pFilesCollectionMap[16]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="道路安全评价-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[16] != null
                      && pFilesCollectionMap[16]['filesMap'][208] != null"
                    v-model="pFilesCollectionMap[16]['filesMap'][208]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(16,208)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(16,208)">下载</el-button>
                </el-form-item>
                <el-form-item label="道路安全评价-安评报告">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[16] != null
                      && pFilesCollectionMap[16]['filesMap'][209] != null"
                    v-model="pFilesCollectionMap[16]['filesMap'][209]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(16,209)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(16,209)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[16] != null"
                    v-model="pFilesCollectionMap[16]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[16] != null"
                    v-model="pFilesCollectionMap[16]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">初步设计-专项-地震安全评价</el-divider>
                <el-form-item label="地震安全评价-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[17] != null"
                    v-model="pFilesCollectionMap[17]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="地震安全评价-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[17] != null"
                    v-model="pFilesCollectionMap[17]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="地震安全评价-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[17] != null
                      && pFilesCollectionMap[17]['filesMap'][212] != null"
                    v-model="pFilesCollectionMap[17]['filesMap'][212]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(17,212)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(17,212)">下载</el-button>
                </el-form-item>
                <el-form-item label="地震安全评价-评价报告">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[17] != null
                      && pFilesCollectionMap[17]['filesMap'][213] != null"
                    v-model="pFilesCollectionMap[17]['filesMap'][213]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(17,213)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(17,213)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[17] != null"
                    v-model="pFilesCollectionMap[17]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[17] != null"
                    v-model="pFilesCollectionMap[17]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">初步设计-专项-风险性评估报告</el-divider>
                <el-form-item label="风险性评估报告-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[18] != null"
                    v-model="pFilesCollectionMap[18]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="风险性评估报告-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[18] != null"
                    v-model="pFilesCollectionMap[18]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="风险性评估报告-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[18] != null
                      && pFilesCollectionMap[18]['filesMap'][216] != null"
                    v-model="pFilesCollectionMap[18]['filesMap'][216]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(18,216)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(18,216)">下载</el-button>
                </el-form-item>
                <el-form-item label="风险性评估报告-评估报告">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[18] != null
                      && pFilesCollectionMap[18]['filesMap'][217] != null"
                    v-model="pFilesCollectionMap[18]['filesMap'][217]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(18,217)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(18,217)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[18] != null"
                    v-model="pFilesCollectionMap[18]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[18] != null"
                    v-model="pFilesCollectionMap[18]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">初步设计-专项-防洪报告</el-divider>
                <el-form-item label="防洪报告-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[19] != null"
                    v-model="pFilesCollectionMap[19]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="防洪报告-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[19] != null"
                    v-model="pFilesCollectionMap[19]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="防洪报告-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[19] != null
                      && pFilesCollectionMap[19]['filesMap'][220] != null"
                    v-model="pFilesCollectionMap[19]['filesMap'][220]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(19,220)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(19,220)">下载</el-button>
                </el-form-item>
                <el-form-item label="防洪报告-评估报告">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[19] != null
                      && pFilesCollectionMap[19]['filesMap'][221] != null"
                    v-model="pFilesCollectionMap[19]['filesMap'][221]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(19,221)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(19,221)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[19] != null"
                    v-model="pFilesCollectionMap[19]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[19] != null"
                    v-model="pFilesCollectionMap[19]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">初步设计-专项-不涉及敏感区-环评</el-divider>
                <el-form-item label="不涉及敏感区-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[20] != null"
                    v-model="pFilesCollectionMap[20]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="不涉及敏感区-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[20] != null"
                    v-model="pFilesCollectionMap[20]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="不涉及敏感区-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[20] != null
                      && pFilesCollectionMap[20]['filesMap'][224] != null"
                    v-model="pFilesCollectionMap[20]['filesMap'][224]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(20,224)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(20,224)">下载</el-button>
                </el-form-item>
                <el-form-item label="不涉及敏感区-批复文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[20] != null
                      && pFilesCollectionMap[20]['filesMap'][225] != null"
                    v-model="pFilesCollectionMap[20]['filesMap'][225]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(20,225)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(20,225)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[20] != null"
                    v-model="pFilesCollectionMap[20]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[20] != null"
                    v-model="pFilesCollectionMap[20]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">初步设计-行审意见</el-divider>
                <el-form-item label="初步设计-部审意见">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[21] != null
                      && pFilesCollectionMap[21]['filesMap'][228] != null"
                    v-model="pFilesCollectionMap[21]['filesMap'][228]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(21,228)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(21,228)">下载</el-button>
                </el-form-item>
                <el-form-item label="初步设计-厅审意见">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[21] != null
                      && pFilesCollectionMap[21]['filesMap'][229] != null"
                    v-model="pFilesCollectionMap[21]['filesMap'][229]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(21,229)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(21,229)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="初步设计-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[21] != null"
                    v-model="pFilesCollectionMap[21]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="初步设计-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[21] != null"
                    v-model="pFilesCollectionMap[21]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="初步设计-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[21] != null
                      && pFilesCollectionMap[21]['filesMap'][230] != null"
                    v-model="pFilesCollectionMap[21]['filesMap'][230]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(21,230)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(21,230)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[21] != null"
                    v-model="pFilesCollectionMap[21]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[21] != null"
                    v-model="pFilesCollectionMap[21]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">设计文件</el-divider>
                <el-form-item label="初步设计-设计文件（主要工程规模）">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[22] != null
                      && pFilesCollectionMap[22]['filesMap'][233] != null"
                    v-model="pFilesCollectionMap[22]['filesMap'][233]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(22,233)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(22,233)">下载</el-button>
                </el-form-item>
                <el-form-item label="施工图设计-设计文件（主要工程规模等）">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[25] != null
                      && pFilesCollectionMap[25]['filesMap'][246] != null"
                    v-model="pFilesCollectionMap[25]['filesMap'][246]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(25,246)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(25,246)">下载</el-button>
                </el-form-item>

                <el-divider content-position="center">施工图设计-专项-压覆矿产</el-divider>
                <el-form-item label="有压覆矿产情况-压覆矿产报告书">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[23] != null
                      && pFilesCollectionMap[23]['filesMap'][237] != null"
                    v-model="pFilesCollectionMap[23]['filesMap'][237]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(23,237)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(23,237)">下载</el-button>
                </el-form-item>
                <el-form-item label="无压覆矿产情况-批复文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[23] != null
                      && pFilesCollectionMap[23]['filesMap'][238] != null"
                    v-model="pFilesCollectionMap[23]['filesMap'][238]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(23,238)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(23,238)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="压覆矿产-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[23] != null"
                    v-model="pFilesCollectionMap[23]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="压覆矿产-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[23] != null"
                    v-model="pFilesCollectionMap[23]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="压覆矿产-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[23] != null
                      && pFilesCollectionMap[23]['filesMap'][239] != null"
                    v-model="pFilesCollectionMap[23]['filesMap'][239]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(23,239)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(23,239)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[23] != null"
                    v-model="pFilesCollectionMap[23]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[23] != null"
                    v-model="pFilesCollectionMap[23]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">施工图设计-专项-地质灾害危险性评估</el-divider>
                <el-form-item label="地质灾害危险性评估-评估报告书">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[24] != null
                      && pFilesCollectionMap[24]['filesMap'][242] != null"
                    v-model="pFilesCollectionMap[24]['filesMap'][242]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(24,242)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(24,242)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="地质灾害危险性评估-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[24] != null"
                    v-model="pFilesCollectionMap[24]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="地质灾害危险性评估-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[24] != null"
                    v-model="pFilesCollectionMap[24]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="地质灾害危险性评估-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[24] != null
                      && pFilesCollectionMap[24]['filesMap'][243] != null"
                    v-model="pFilesCollectionMap[24]['filesMap'][243]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(24,243)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(24,243)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[24] != null"
                    v-model="pFilesCollectionMap[24]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[24] != null"
                    v-model="pFilesCollectionMap[24]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

                <el-divider content-position="center">施工图设计-施工图设计-行审意见</el-divider>
                <el-form-item label="施工图设计-厅审意见文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[26] != null
                      && pFilesCollectionMap[26]['filesMap'][247] != null"
                    v-model="pFilesCollectionMap[26]['filesMap'][247]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(26,247)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(26,247)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="施工图设计-上报文件名称">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[26] != null"
                    v-model="pFilesCollectionMap[26]['reportFileName']"
                  />
                </el-form-item>
                <el-form-item label="施工图设计-上报文件号">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[26] != null"
                    v-model="pFilesCollectionMap[26]['reportFileNo']"
                  />
                </el-form-item>
                <el-form-item label="施工图设计-上报文件">
                  <el-input
                    v-if="pFilesCollectionMap != null
                      && pFilesCollectionMap[26] != null
                      && pFilesCollectionMap[26]['filesMap'][248] != null"
                    v-model="pFilesCollectionMap[26]['filesMap'][248]['fname']"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    v-if="!isShow"
                    ref="upload"
                    class="upload-demo inline-block"
                    action="https://jsonplacehoder.typeicon.com/posts/"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :on-success="onSuccess"
                  >
                    <el-button size="small" type="primary" @click="setFileType(26,248)">点击上传</el-button>
                  </el-upload>
                  <el-button v-if="isShow" size="small" type="primary" @click="getFileByFcTypeAndPfClass(26,248)">下载</el-button>
                </el-form-item>
                <div />
                <el-form-item label="办理情况">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[26] != null"
                    v-model="pFilesCollectionMap[26]['situation']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>
                <div />
                <el-form-item label="存在问题">
                  <el-input
                    v-if="pFilesCollectionMap != null && pFilesCollectionMap[26] != null"
                    v-model="pFilesCollectionMap[26]['problem']"
                    type="textarea"
                    :rows="4"
                    maxlength="300"
                    show-word-limit
                    placeholder="请输入内容"
                    resize="both"
                    class="textarea-class"
                  />
                </el-form-item>

              </el-form>

              <el-form :inline="true" :disabled="isShow">
                <el-divider content-position="center">初步设计</el-divider>
                <el-form-item label="项目承担单位（负责人）">
                  <el-input v-model="pPrework.undertakeUnitHead" placeholder="负责人" />
                </el-form-item>
                <el-form-item label="项目承担单位（联系方式）">
                  <el-input v-model="pPrework.undertakeUnitContact" placeholder="联系方式" />
                </el-form-item>
                <el-form-item label="项目承担单位（单位名称）">
                  <el-input v-model="pPrework.undertakeUnitName" placeholder="单位名称" />
                </el-form-item>

                <el-divider content-position="center">施工图设计</el-divider>
                <el-form-item label="项目承担单位（负责人）">
                  <el-input v-model="pPrework.constructUnitHead" placeholder="负责人" />
                </el-form-item>
                <el-form-item label="项目承担单位（联系方式）">
                  <el-input v-model="pPrework.constructUnitContact" placeholder="联系方式" />
                </el-form-item>
                <el-form-item label="项目承担单位（单位名称）">
                  <el-input v-model="pPrework.constructUnitName" placeholder="单位名称" />
                </el-form-item>

              </el-form>
            </div>

          </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" :disabled="isShow" @click="addProjectSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="导出Excel选项"
        fullscreen
        :visible.sync="exportDialogVisible"
        width="90%"
        center
      >
        <div style="max-height:600px;overflow-y:scroll;">
          <el-table
            ref="exportTableRef"
            :data="exportPropList"
            style="width:100%;"
            border
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              prop="exportId"
              label="ID"
              sortable
              show-overflow-tooltip
            />
            <el-table-column
              prop="showName"
              label="导出列名"
              sortable
              show-overflow-tooltip
            />
          </el-table>
        </div>
        <div style="text-align:center;">
          <span>
            <el-button @click="exportDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="exportExcel">确 定</el-button>
          </span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryPMList, addProjectInfo, editProjectInfo, deleteProjectInfo, restoreProjectInfo, getAreaList, getFileClass, fileUpload, fileDownLoad, getExportPropList } from '@/api/pms'
import moment from 'moment'
import $ from 'jquery'
export default {
  name: 'PmInfo',
  data() {
    return {
      searchText: '',
      dialogTitle: '新增',
      addDialogVisible: false,
      exportDialogVisible: false,
      exportPropList: [],
      projectInfo: {},
      currentHighwayLevel: { standardType: 1 }, // 当前公路等级
      mainHighWayLevel: { standardType: 2 }, // 主线建设标准
      projectClass: {},
      pConstruction: {},
      pPrework: {},
      fileClass: {},
      pFilesCollectionMap: null,
      fileParam: {
        fcType: 1,
        pfClass: 164
      },
      collapseActiveNames: ['1', '2'],
      addTabsActiveName: 'baseInfo',
      // 表格当前页数据
      tableData: [],
      // 请求的URL
      url: 'job/queryjob',
      // 默认每页数据量
      pagesize: 10,
      // 当前页码
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000,
      // 添加对话框默认可见性
      dialogFormVisible: false,
      // 修改对话框默认可见性
      updateFormVisible: false,
      // 提交的表单
      form: {
        jobName: '',
        jobGroup: '',
        cronExpression: ''
      },
      updateform: {
        jobName: '',
        jobGroup: '',
        cronExpression: ''
      },
      fileTypes: ['png', 'jpg', 'jpeg', 'zip', 'rar'],
      headers: {},
      options: {
        nationalroadOptions: {
          options: [
            {
              value: 0,
              label: '请选择'
            },
            {
              value: 1,
              label: '国高'
            }, {
              value: 2,
              label: '国道'
            }],
          value: 0
        },
        provinceroadOptions: {
          options: [
            {
              value: 0,
              label: '请选择'
            },
            {
              value: 1,
              label: '省高'
            }, {
              value: 2,
              label: '省道'
            }],
          value: 0
        },
        ruralroadOptions: {
          options: [
            {
              value: 0,
              label: '请选择'
            },
            {
              value: 1,
              label: '县道'
            }, {
              value: 2,
              label: '乡道'
            }, {
              value: 3,
              label: '村道'
            }, {
              value: 4,
              label: '专用公路'
            }],
          value: 0
        },
        planseqOptions: {
          options: [
            {
              value: 0,
              label: '请选择'
            },
            {
              value: 1,
              label: '2020年'
            }, {
              value: 2,
              label: '十四五'
            }, {
              value: 3,
              label: '十五五'
            }, {
              value: 4,
              label: '十六五'
            }],
          value: 0
        },
        planlevelOptions: {
          options: [
            {
              value: 0,
              label: '请选择'
            },
            {
              value: 1,
              label: '一级'
            }, {
              value: 2,
              label: '二级'
            }, {
              value: 3,
              label: '三级'
            },
            {
              value: 4,
              label: '四级'
            },
            {
              value: 5,
              label: '高速'
            },
            {
              value: 6,
              label: '等外'
            }
          ],
          value: 0
        },
        feeOptions: {
          options: [
            {
              value: 0,
              label: '请选择'
            },
            {
              value: 1,
              label: '政府还贷'
            }, {
              value: 2,
              label: '经营性收费'
            }],
          value: 0
        },
        notfeeOptions: {
          options: [
            {
              value: 1,
              label: '是'
            }, {
              value: 2,
              label: '否'
            }],
          value: 2
        },
        townBoundaryOptions: {
          options: [
            {
              value: 1,
              label: '符合'
            }, {
              value: 0,
              label: '不符合'
            }],
          value: 0
        },
        baseFarmlandOptions: {
          options: [
            {
              value: 1,
              label: '符合'
            }, {
              value: 0,
              label: '不符合'
            }],
          value: 0
        },
        environmentRedlineOptions: {
          options: [
            {
              value: 1,
              label: '符合'
            }, {
              value: 0,
              label: '不符合'
            }],
          value: 0
        },
        militaryAreaOptions: {
          options: [
            {
              value: 1,
              label: '符合'
            }, {
              value: 0,
              label: '不符合'
            }],
          value: 0
        },
        channelTypeOptions: {
          options: [
            {
              value: 0,
              label: '请选择'
            },
            {
              value: 1,
              label: '北通道'
            }, {
              value: 2,
              label: '南通道'
            }, {
              value: 3,
              label: '中通道'
            }, {
              value: 4,
              label: '南北疆通道'
            }, {
              value: 5,
              label: '中巴经济走廊'
            }],
          value: 0
        },
        encircleTypeOptions: {
          options: [
            {
              value: 0,
              label: '请选择'
            },
            {
              value: 1,
              label: '环准格尔盆地'
            }, {
              value: 2,
              label: '环塔里木盆地'
            }, {
              value: 3,
              label: '天山环'
            }],
          value: 0
        }
      },
      projectClassOptions: {
        projectClassOptions: {
          options: [
            {
              value: null,
              label: '请选择'
            },
            {
              value: 1,
              label: '交旅融合项目'
            }, {
              value: 2,
              label: '通县高速或一级'
            }, {
              value: 3,
              label: '兵地融合项目'
            }],
          value: null
        },
        portClassOptions: {
          options: [
            {
              value: null,
              label: '请选择'
            },
            {
              value: 1,
              label: '一类口岸'
            }, {
              value: 2,
              label: '二类口岸'
            }],
          value: null
        },
        parkClassOptions: {
          options: [
            {
              value: null,
              label: '请选择'
            },
            {
              value: 1,
              label: '国家级'
            }, {
              value: 2,
              label: '自治区级'
            }],
          value: null
        },
        logisticsClassOptions: {
          options: [
            {
              value: null,
              label: '请选择'
            },
            {
              value: 1,
              label: '国家级'
            }, {
              value: 2,
              label: '自治区级'
            }],
          value: null
        },
        isGbfOptions: {
          options: [
            {
              value: 0,
              label: '否'
            }, {
              value: 1,
              label: '是'
            }],
          value: 0
        }
      },
      pConstructionOptions: {
        cityCodeOptions: {
          options: [
            {
              value: null,
              label: '请选择'
            },
            {
              value: '650100',
              label: '乌鲁木齐市'
            }, {
              value: '650200',
              label: '克拉玛依市'
            }],
          value: null
        },
        countyCodeOptions: {
          options: [
            {
              value: null,
              label: '请选择'
            },
            {
              value: '650102',
              label: '天山区'
            }, {
              value: '650103',
              label: '沙依巴克区'
            }],
          value: null
        },
        cpModeOptions: {
          options: [
            {
              value: null,
              label: '请选择'
            },
            {
              value: 1,
              label: '政府还债'
            }, {
              value: 2,
              label: '企业经营'
            }, {
              value: 3,
              label: 'PPP'
            }],
          value: 2
        }
      },
      pPreworkOptions: {
        isPlanoutConformityOptions: {
          options: [
            {
              value: 0,
              label: '不符合'
            }, {
              value: 1,
              label: '符合'
            }],
          value: 0
        }
      },
      isShow: false,
      submitType: 1, // 1:新增，2：编辑
      filters: {
        options: {
          isDeleteOptions: {
            options: [
              {
                value: null,
                label: '全部'
              },
              {
                value: 1,
                label: '禁用'
              }, {
                value: 0,
                label: '正常'
              }],
            value: 0
          }
        }

      },
      showFiles: false,
      projectInfoRules: {
        projectcode: [
          { required: true, message: '请输入项目编号', trigger: 'blur' }
        ],
        projectname: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        roadcode: [
          { required: true, message: '请输入路线编号', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.initFun()
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {
    // 搜索
    search: function() {
      this.loadData(this.currentPage, this.pagesize)
    },
    addClick: function() {
      this.projectInfo = {}
      this.currentHighwayLevel = { standardType: 1 }// 当前公路等级
      this.mainHighWayLevel = { standardType: 2 } // 主线建设标准
      this.curr
      this.dialogTitle = '新增'
      this.addTabsActiveName = 'baseInfo'
      this.submitType = 1
      this.addDialogVisible = true
    },
    addProjectSubmit: function() {
      this.$refs['projectInfoForm'].validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.addProjectInfo()
        } else {
          console.log('error sunmit!!!')
          return false
        }
      })
    },
    addProjectInfo: function() {
      this.currentHighwayLevel.projectcode = this.projectInfo.projectcode
      this.mainHighWayLevel.projectcode = this.projectInfo.projectcode

      this.projectInfo.currentHighwayLevel = this.currentHighwayLevel
      this.projectInfo.mainHighWayLevel = this.mainHighWayLevel
      this.projectInfo.pProjectClass = this.projectClass
      this.projectInfo.pConstruction = this.pConstruction
      this.projectInfo.pPrework = this.pPrework
      this.optionsToInfo()
      if (this.submitType === 1) { // 新增
        addProjectInfo(this.projectInfo).then(response => {
          console.log(response)
          this.addDialogVisible = false
          if (response.status === 200) {
            this.search()
            this.$message({
              type: 'success',
              message: '新增成功'
            })
          } else {
            this.search()
            this.$message({
              type: 'warning',
              message: response.message
            })
          }
        })
      } else if (this.submitType === 2) { // 编辑
        editProjectInfo(this.projectInfo).then(response => {
          this.addDialogVisible = false
          if (response.status === 200) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.search()
          }
        })
      }
    },
    optionsToInfo: function() {
      for (var key in this.options) {
        var propKey = key.substr(0, key.length - 7)
        this.projectInfo[propKey] = this.options[key]['value']
      }
      for (var keyPC in this.projectClassOptions) {
        var propKeyPC = keyPC.substr(0, keyPC.length - 7)
        this.projectClass[propKeyPC] = this.projectClassOptions[keyPC]['value']
      }
      for (var keyPCN in this.pConstructionOptions) {
        var propKeyPCN = keyPCN.substr(0, keyPCN.length - 7)
        this.pConstruction[propKeyPCN] = this.pConstructionOptions[keyPCN]['value']
      }
      for (var keyPW in this.pPreworkOptions) {
        var propKeyPW = keyPW.substr(0, keyPW.length - 7)
        this.pPrework[propKeyPW] = this.pPreworkOptions[keyPW]['value']
      }
    },
    infoToOptions: function() {
      for (var key in this.options) {
        var propKey = key.substr(0, key.length - 7)
        this.options[key]['value'] = this.projectInfo[propKey]
      }
      // 项目类别select属性初始化
      if (this.projectInfo.pProjectClass != null) {
        for (var keyPC in this.projectClassOptions) {
          var propKeyPC = keyPC.substr(0, keyPC.length - 7)
          this.projectClassOptions[keyPC]['value'] = this.projectInfo.pProjectClass[propKeyPC]
        }
      }
      // 项目建设管理select属性初始化
      if (this.projectInfo.pConstruction != null) {
        for (var keyPCN in this.pConstructionOptions) {
          var propKeyPCN = keyPCN.substr(0, keyPCN.length - 7)
          this.pConstructionOptions[keyPCN]['value'] = this.projectInfo.pConstruction[propKeyPCN]
        }
      }
      // 项目前期工作select属性初始化
      if (this.projectInfo.pPrework != null) {
        for (var keyPW in this.pPreworkOptions) {
          var propKeyPW = keyPW.substr(0, keyPW.length - 7)
          this.pPreworkOptions[keyPW]['value'] = this.projectInfo.pPrework[propKeyPW]
        }
      }
    },
    // 从服务器读取数据
    loadData: function(pageNum, pageSize) {
      this.getFilters()
      const that = this
      this.projectInfo.pageNum = pageNum
      this.projectInfo.pageSize = pageSize
      queryPMList(this.projectInfo).then(response => {
        that.tableData = response.list.list
        that.totalCount = response.number
      })
    },
    getFilters: function() {
      this.projectInfo = {}
      this.projectInfo.projectname = this.searchText
      for (var key in this.filters.options) {
        var propKey = key.substr(0, key.length - 7)
        this.projectInfo[propKey] = this.filters.options[key]['value']
      }
    },
    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.loadData(this.currentPage, this.pagesize)
    },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.loadData(this.currentPage, this.pagesize)
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeUpload(file) {
      var that = this
      var upLoadFileName = file.name
      // 如果上传的文件不符合条件
      var checkMessage = this.fileCheck(file)
      if (checkMessage !== '') {
        this.$message(checkMessage)
        return
      }
      var formData = new FormData()
      formData.append('file', file)

      // var filesCollectionParam = this.projectInfo.pPrework.pFilesCollectionMap[this.fileParam.fcType]
      var filesCollectionParamTemp = this.pFilesCollectionMap[this.fileParam.fcType]
      var filesCollectionParam = {
        fcId: filesCollectionParamTemp.fcId,
        preId: filesCollectionParamTemp.preId,
        reportFileName: filesCollectionParamTemp.reportFileName,
        reportFileNo: filesCollectionParamTemp.reportFileNo,
        situation: filesCollectionParamTemp.situation,
        problem: filesCollectionParamTemp.problem,
        fcType: this.fileParam.fcType
      }
      // filesCollectionParam.fcType = this.fileParam.fcType
      // var filesParam = this.projectInfo.pPrework.pFilesCollectionMap[this.fileParam.fcType]['filesMap'][this.fileParam.pfClass]
      var filesParamTemp = this.pFilesCollectionMap[this.fileParam.fcType]['filesMap'][this.fileParam.pfClass]
      var filesParam = null
      if (filesParamTemp === undefined || filesParamTemp === null) {
        filesParam = {
          fcType: this.fileParam.fcType,
          pfClass: this.fileParam.pfClass
        }
      } else {
        filesParam = {
          pfId: filesParamTemp.pfId,
          fcId: filesParamTemp.fcId,
          pfClass: this.fileParam.pfClass,
          fcType: this.fileParam.fcType
        }
      }
      formData.append('pFilesCollectionStr', JSON.stringify(filesCollectionParam))
      formData.append('pFilesStr', JSON.stringify(filesParam))
      fileUpload(formData).then(response => {
        console.log(response)
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: '文件上传成功'
          })
          that.pFilesCollectionMap[that.fileParam.fcType]['filesMap'][that.fileParam.pfClass]['fname'] = upLoadFileName
        } else if (response.status === 500) {
          this.$message({
            type: 'warning',
            message: `文件上传失败,失败原因${response.msg}`
          })
        }
      })
    },
    setFileType(fcType, pfClass) {
      this.fileParam.fcType = fcType
      this.fileParam.pfClass = pfClass
    },
    getFileByFcTypeAndPfClass(fcType,pfClass){
      var filesMap = this.pFilesCollectionMap[fcType].filesMap
      var fileObj = filesMap[pfClass]
      if(filesMap == null || fileObj == null || fileObj.pfId == null){
        this.$message({
          type: 'warning',
          message: "文件不存在！"
        })
        return false;
      }
      this.handleDownload(0,fileObj);
    },

    onSuccess(response, file, fileList) {
      console.log(response, file, fileList)
    },

    // 前端校验文件上传是否符合条件
    fileCheck(file) {
      var ret = ''
      if (file === undefined) {
        ret = ''
      }
      var max_file_size = 20 * 1024 * 1024
      if (file.size > max_file_size) {
        ret = '图片不能大于20Mb'
      }
      // var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      // if (!this.validFile(fileType)) {
      //   ret = '文件类型不符合要求'
      // }
      return ret
    },
    validFile(type) {
      var result = false
      for (var i = 0; i < this.fileTypes.length; i++) {
        if (this.fileTypes[i] === type) {
          result = true
          return result
        }
      }
      return result
    },
    formatDate(row, column) {
      // 获取单元格数据
      const date = row[column.property]
      if (date === undefined || date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    formatOptions(row, column) {
      // 获取单元格数据
      const val = row[column.property]
      var result = '正常'
      switch (val) {
        case 0:
          result = '正常'
          break
        case 1:
          result = '禁用'
          break
        default:
          result = '正常'
          break
      }
      return result
    },
    // 单行删除
    handleDelete: function(index, row) {
      this.projectInfo = row
      const that = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteProjectInfo(that.projectInfo).then(response => {
            this.search()
            that.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleEdit: function(index, row) {
      this.dialogTitle = '编辑'
      this.submitType = 2
      this.initRowToObj(row)
      this.addDialogVisible = true
    },
    handleShow: function(index, row) {
      console.log(index, row)
      this.dialogTitle = '查看'
      this.initRowToObj(row)
      this.isShow = true
      this.addDialogVisible = true
      // 获取前期工作模块中的文件列表
      this.pFilesCollectionMap = row.pPrework.pFilesCollectionMap
    },
    initRowToObj: function(row) {
      var that = this
      this.projectInfo = JSON.parse(JSON.stringify(row))
      this.infoToOptions()
      // 初始化 途经县 属性
      this.getCountyList({ pCode: this.pConstructionOptions.cityCodeOptions.value }, function(option, value) {
        that.pConstructionOptions.countyCodeOptions.options = option
        that.pConstructionOptions.countyCodeOptions.value = that.projectInfo.pConstruction.countyCode
      })

      if (this.projectInfo.currentHighwayLevel === null) {
        this.currentHighwayLevel = {}
        this.currentHighwayLevel.projectcode = this.projectInfo.projectcode
      } else {
        this.currentHighwayLevel = this.projectInfo.currentHighwayLevel
      }
      if (this.projectInfo.mainHighWayLevel === null) {
        this.mainHighWayLevel = {}
        this.mainHighWayLevel.projectcode = this.projectInfo.projectcode
      } else {
        this.mainHighWayLevel = this.projectInfo.mainHighWayLevel
      }
      if (this.projectInfo.pProjectClass === null) {
        this.projectClass = {}
        this.projectClass.projectcode = this.projectInfo.projectcode
      } else {
        this.projectClass = this.projectInfo.pProjectClass
      }
      if (this.projectInfo.pConstruction === null) {
        this.pConstruction = {}
        this.pConstruction.projectcode = this.projectInfo.projectcode
      } else {
        this.pConstruction = this.projectInfo.pConstruction
      }
      if (this.projectInfo.pPrework === null) {
        this.pPrework = {}
        this.pPrework.projectcode = this.projectInfo.projectcode
      } else {
        this.pPrework = this.projectInfo.pPrework
        this.pPrework.projectcode = this.projectInfo.projectcode
      }
      // 项目前期工作附件
      // this.getFilesCollectionMap(this.projectInfo.pPrework.pFilesCollectionList)
      this.pFilesCollectionMap = this.projectInfo.pPrework.pFilesCollectionMap
      this.showFiles = true
    },
    handleRestore: function(index, row) {
      this.projectInfo = row
      restoreProjectInfo(this.projectInfo).then(response => {
        this.search()
        this.$message({
          type: 'success',
          message: '解禁成功'
        })
      })
    },
    handleAddTabsClick: function(index, row) {
      console.log(index, row)
    },
    handleDownload: function(index, row) {
      console.log(index, row)

      fileDownLoad(row).then(response => {
        const data = response.data
        if (!data) {
          this.$message({
            type: 'warning',
            message: '下载失败'
          })
          return
        }
        console.log(response)
        const fileName = row.fname
        console.log('fileName=' + fileName)
        const url = window.URL.createObjectURL(new Blob([data]))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', fileName)
        document.body.appendChild(a)
        // 点击下载
        a.click()
        // 下载完成移除元素
        document.body.removeChild(a)
        // 释放掉blob对象
        window.URL.revokeObjectURL(url)
        console.log('下载完成')
      })
    },
    addDialogClose: function() {
      this.projectInfo = {}
      this.isShow = false
      this.addDialogVisible = false
    },
    initFun: function() {
      this.getCityList({ pCode: '650000' })
      this.getFileClass()
    },
    getCityList: function(data) {
      getAreaList(data).then(response => {
        console.log(response)
        this.cityListToOptions(response.list)
      })
    },
    cityListToOptions: function(list) {
      var _options = []
      var _value = ''
      for (var index = 0; index < list.length; index++) {
        console.log(index)
        var cityItem = list[index]
        _options.push({ value: cityItem.addrCode, label: cityItem.addrName })
        if (index === 0) {
          _value = cityItem.addrCode
        }
      }
      this.pConstructionOptions.cityCodeOptions.options = _options
      this.pConstructionOptions.cityCodeOptions.value = _value
    },
    getCountyList: function(data, callback) {
      getAreaList(data).then(response => {
        this.countyListToOptions(response.list, callback)
      })
    },
    countyListToOptions: function(list, callback) {
      var _options = []
      var _value = ''
      for (var index = 0; index < list.length; index++) {
        var item = list[index]
        _options.push({ value: item.addrCode, label: item.addrName })
        if (index === 0) {
          _value = item.addrCode
        }
      }
      callback(_options, _value)
      // this.pConstructionOptions.countyCodeOptions.options = _options
      // this.pConstructionOptions.countyCodeOptions.value = _value

      // console.log('this.projectInfo.pConstruction.countyCode', this.projectInfo.pConstruction.countyCode)
      // this.pConstructionOptions.countyCodeOptions.value = this.projectInfo.pConstruction.countyCode
    },
    citySelectChange: function() {
      var that = this
      this.getCountyList({ pCode: this.pConstructionOptions.cityCodeOptions.value }, function(option, value) {
        that.pConstructionOptions.countyCodeOptions.options = option
        that.pConstructionOptions.countyCodeOptions.value = value
      })
    },
    getFileClass: function() {
      getFileClass({ dictGroupName: '项目前期工作附件' }).then(response => {
        console.log(response)
        this.fileClass = response.map
      })
    },
    getFilesCollectionMap: function(list) {
      this.pFilesCollectionMap = {}
      for (var i = 0; i < list.length; i++) {
        var fcItem = list[i]
        this.pFilesCollectionMap[fcItem.fcType] = fcItem
      }
      var _map = Object.getOwnPropertyNames(this.pFilesCollectionMap)
      if (_map.length === 0) {
        this.pFilesCollectionMap = this.fileClass
      }
      this.showFiles = true
      return this.pFilesCollectionMap
    },
    exportExcel: function() {
      // var fileName = '规划项目'
      console.log(process.env.VUE_APP_BASE_API)

      var selectedRows = this.$refs.exportTableRef.store.states.selection
      console.log('selectedRows', selectedRows)
      if (selectedRows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择导出列'
        })
        return
      }

      // 编码防止中文字符乱码
      // window.location.href = encodeURI(process.env.VUE_APP_BASE_API + '/cross/exportXls?fileName=' + encodeURIComponent(fileName))

      var form = $('<form>')
      form.attr('style', 'display:none')
      form.attr('target', '')
      form.attr('method', 'post')
      form.attr('action', process.env.VUE_APP_BASE_API + '/cross/exportXls')

      var input1 = $('<input>')
      input1.attr('type', 'hidden')
      input1.attr('name', 'list')
      input1.attr('value', JSON.stringify(selectedRows))

      $('body').append(form)
      form.append(input1)

      form.submit()
      form.remove()
    },
    getExportPropList: function() {
      var that = this
      getExportPropList({}).then(response => {
        var list = response.list
        that.exportPropList = list
        that.exportDialogVisible = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$dark_gray:#889aa4;
.show-pwd {
  position: absolute;
  right: 10px;
  top: 0px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
.inline-block {
  display: inline-block;
}
.textarea-class{
  width:910px;
}
</style>

