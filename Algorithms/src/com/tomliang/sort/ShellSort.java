package com.tomliang.sort;

import com.tomliang.Utils;

/**
 * 
 * @author lianghangbing
 * <p>希尔排序</p>
 * <p>排序原理:</p>
 * <p>希尔排序是插入排序的改进，将数组分为若干子集进行插入排序，然后递减子集数继续插入排序。</p>
 * <p>有效的规避了插入排序最小元素出现在末端导致比较成本增大的情况</p>
 * @param <T>
 */
public abstract class ShellSort<T> implements ISort<T> {

	public void sort(T[] arr) {
		if(arr == null){
			throw new IllegalArgumentException("数组不能为空");
		}
		
		int N = arr.length;
		int h = 1;
		while(h < N/3){
			h = 3*h + 1;
		}
		
		while(h >= 1){
			for(int i=h; i<N; i++){
				for(int j=i; j>=h && less(arr[j], arr[j-h]); j -= h){
					Utils.exc(arr, j, j-h);
				}
			}
			h = h/3;
		}
	}

	public abstract boolean less(T t1, T t2);

}
