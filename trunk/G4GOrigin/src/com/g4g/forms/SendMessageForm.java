/**********************************************************
 * SendMessageForm.java : 
 *
 * Created 15 Feb .08 by Jigar Mistry
 * Last modified Date: 18 Apr .08 by Punam
 * Revision: 0.1
 * Version : 0.0.8
 * Copyright (c) 2008 - 2008 Askdigi, All rights reserved.
 **********************************************************/

package com.g4g.forms;

import org.apache.log4j.Level;

import com.g4g.dto.BaseDTO;
import com.g4g.utils.AuditUtil;
import com.g4g.utils.DataUtil;
import com.g4g.utils.G4GConstants;

/**
 * Form contains properties for send message.SendMessageAction uses the
 * SendMessaeForm in struts-config in its action definition.
 * 
 * @author Jigar Mistry
 */
public class SendMessageForm extends BaseForm {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1598630524002849249L;

	/**
	 * @see com.g4g.forms.BaseForm#getDTO()
	 */
	@Override
	public BaseDTO getDTO() {
		AuditUtil.getInstance().writeLog(
				AuditUtil.FILE_TYPE_G4G,
				new StringBuffer(this.getClass().getName()).append(
						G4GConstants.COLON_WITH_SPACES).append(G4GConstants.CALLINGMETHOD)
						.append(DataUtil.getCallingMethod()).append(
								G4GConstants.CURRENTMETHOD).append(
								DataUtil.getCurrentMethod()).append(
								G4GConstants.DASHES).append(
								G4GConstants.STARTED).toString(), Level.INFO);
		AuditUtil.getInstance().writeLog(
				AuditUtil.FILE_TYPE_G4G,
				new StringBuffer(this.getClass().getName()).append(
						G4GConstants.COLON_WITH_SPACES).append(G4GConstants.CALLINGMETHOD)
						.append(DataUtil.getCallingMethod()).append(
								G4GConstants.CURRENTMETHOD).append(
								DataUtil.getCurrentMethod()).append(
								G4GConstants.DASHES).append(G4GConstants.ENDED)
						.toString(), Level.INFO);
		return null;
	}

	/**
	 * @see com.g4g.forms.BaseForm#populate(com.g4g.dto.BaseDTO)
	 */
	@Override
	public void populate(BaseDTO baseDto) {
		AuditUtil.getInstance().writeLog(
				AuditUtil.FILE_TYPE_G4G,
				new StringBuffer(this.getClass().getName()).append(
						G4GConstants.COLON_WITH_SPACES).append(G4GConstants.CALLINGMETHOD)
						.append(DataUtil.getCallingMethod()).append(
								G4GConstants.CURRENTMETHOD).append(
								DataUtil.getCurrentMethod()).append(
								G4GConstants.DASHES).append(
								G4GConstants.STARTED).toString(), Level.INFO);
		AuditUtil.getInstance().writeLog(
				AuditUtil.FILE_TYPE_G4G,
				new StringBuffer(this.getClass().getName()).append(
						G4GConstants.COLON_WITH_SPACES).append(G4GConstants.CALLINGMETHOD)
						.append(DataUtil.getCallingMethod()).append(
								G4GConstants.CURRENTMETHOD).append(
								DataUtil.getCurrentMethod()).append(
								G4GConstants.DASHES).append(G4GConstants.ENDED)
						.toString(), Level.INFO);
	}
}