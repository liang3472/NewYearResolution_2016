package com.tomliang;

public class main {
	public static void main(String[] args){
		Integer[] arr = {2,5,1,4,3};
		
		// ======================选择排序======================
//		SelectSort<Integer> selectSort = new SelectSort<Integer>() {
//			
//			@Override
//			public boolean less(Integer t1, Integer t2) {
//				return t1 < t2;
//			}
//		};
//		
//		selectSort.sort(arr);
		
		// ======================插入排序======================
//		InsertSort<Integer> insertSort = new InsertSort<Integer>() {
//			
//			@Override
//			public boolean less(Integer t1, Integer t2) {
//				return t1 < t2;
//			}
//		};
//		
//		insertSort.sort(arr);
		
		// ======================希尔排序======================
		ShellSort<Integer> shellSort = new ShellSort<Integer>() {
			
			@Override
			public boolean less(Integer t1, Integer t2) {
				return t1 < t2;
			}
		};
		
		shellSort.sort(arr);
		
		for(int num : arr){
			System.out.println(num);
		}
	}
}
