import React from 'react';
import {CurveType, LineChart} from 'react-native-gifted-charts';
import {Colors} from '../../theme';
import {StyleSheet, Text, View} from 'react-native';
import {GraphDataList, GraphData} from '../../logic/api';

interface GraphComponentProps {
  data?: GraphData;
  graphColor: string;
  yAxis: string[];
  width: number;
  multiple?: GraphDataList;
}

const GraphComponent = ({
  data,
  yAxis,
  graphColor,
  width,
  multiple,
}: GraphComponentProps) => {
  if (data) {
    if (data.data.length === 1) {
      return (
        <Text style={styles.emptyText}>
          Im gewählten Zeitraum liegen keine Spendendaten vor.
        </Text>
      );
    }
    return (
      <>
        <LineChart
          initialSpacing={0}
          data={data.data}
          width={width - 64}
          adjustToWidth
          hideDataPoints
          thickness={2}
          maxValue={data.maxValue}
          stepValue={data.stepValue}
          noOfSections={data.noOfSections}
          rulesType="solid"
          rulesColor="rgba(255, 255, 255, 0.2)"
          disableScroll={true}
          hideOrigin
          curved={true}
          curveType={CurveType.QUADRATIC}
          yAxisThickness={0}
          yAxisTextStyle={styles.yAxisText}
          yAxisLabelSuffix="k"
          yAxisLabelWidth={40}
          yAxisLabelContainerStyle={styles.yAxisLabelContainer}
          xAxisColor="rgba(255, 255, 255, 0.2)"
          color={graphColor}
          areaChart
          startFillColor={graphColor}
          endFillColor={graphColor}
          startOpacity={0.7}
          endOpacity={0}
        />
        <View style={styles.dateContainer}>
          {yAxis.map(year => (
            <Text key={year} style={styles.dateText}>
              {year}
            </Text>
          ))}
        </View>
      </>
    );
  }
  if (multiple) {
    const defaultEmptyData: GraphData['data'] = [];
    const defaultColor: string = 'transparent';
    const data1 = multiple.graphDataList[0].data || defaultEmptyData;
    const color1 = multiple.graphDataList[0].color || defaultColor;

    const data2 = multiple.graphDataList[1].data || defaultEmptyData;
    const color2 = multiple.graphDataList[1].color || defaultColor;

    const data3 = multiple.graphDataList[2]?.data || defaultEmptyData;
    const color3 = multiple.graphDataList[2]?.color || defaultColor;

    const data4 = multiple.graphDataList[3]?.data || defaultEmptyData;
    const color4 = multiple.graphDataList[3]?.color || defaultColor;

    const data5 = multiple.graphDataList[4]?.data || defaultEmptyData;
    const color5 = multiple.graphDataList[4]?.color || defaultColor;
    return (
      <>
        <LineChart
          initialSpacing={0}
          data={data1}
          data2={data2}
          data3={data3}
          data4={data4}
          data5={data5}
          width={width - 64}
          adjustToWidth
          hideDataPoints
          thickness={2}
          maxValue={multiple.maxValue}
          stepValue={multiple.stepValue}
          noOfSections={multiple.noOfSections}
          rulesType="solid"
          rulesColor="rgba(255, 255, 255, 0.2)"
          disableScroll={true}
          hideOrigin
          curved={true}
          curveType={CurveType.QUADRATIC}
          yAxisThickness={0}
          yAxisTextStyle={styles.yAxisText}
          yAxisLabelSuffix="k"
          yAxisLabelWidth={40}
          yAxisLabelContainerStyle={styles.yAxisLabelContainer}
          xAxisColor="rgba(255, 255, 255, 0.2)"
          color1={color1}
          color2={color2}
          color3={color3}
          color4={color4}
          color5={color5}
        />
        <View style={styles.dateContainer}>
          {yAxis.map(year => (
            <Text key={year} style={styles.dateText}>
              {year}
            </Text>
          ))}
        </View>
      </>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 32,
  },
  yAxisText: {
    color: Colors.white70,
    fontSize: 12,
  },
  yAxisLabelContainer: {
    marginRight: 8,
  },
  dateContainer: {
    marginLeft: 40,
    marginTop: -5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dateText: {
    fontSize: 12,
    lineHeight: 13,
    color: Colors.white70,
  },
});

export default GraphComponent;
