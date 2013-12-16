package com.lycenway.chr_mobi_app_prj;

import android.os.Bundle;
import org.apache.cordova.*;

public class ChrMobiActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.loadUrl("file:///android_asset/www/index.html");
	}

}
