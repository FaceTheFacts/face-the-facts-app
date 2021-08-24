import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, ViewProps} from 'react-native';

type DeepMap<T> = {[key: string]: DeepMap<T> | T};

function deepMerge<A extends object, B extends object>(a: A, b: B): A & B {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  const mergeKeys = keysB.filter(value => keysA.includes(value));
  const result: any = {};

  keysA.forEach(key => (result[key] = (a as any)[key]));
  keysB.forEach(key => (result[key] = (b as any)[key]));
  mergeKeys.forEach(key => {
    const valueB = (b as any)[key];

    if (typeof valueB === 'object' && !Array.isArray(valueB)) {
      const valueA = (a as any)[key];
      result[key] = deepMerge(valueA, valueB);
    }
  });

  return result;
}

const TransitionView = (props: ViewProps) => {
  const values = useRef<DeepMap<Animated.Value>>({}).current;

  useEffect(() => {
  }, [props]);

  return <Animated.View {...deepMerge(props, values)} />;
};

export default TransitionView;
