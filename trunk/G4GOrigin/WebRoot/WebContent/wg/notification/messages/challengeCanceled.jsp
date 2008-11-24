<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean" %>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>

<%@page import="com.g4g.utils.G4GConstants"%>
<%@page import="com.g4g.dto.PlayerDTO"%>
<%@page import="com.g4g.delegator.PlayerServiceDelegator"%>
<%@page import="com.g4g.utils.DataUtil"%>
<%@page import="com.g4g.delegator.TwoPlayerMatchServiceDelegator"%>
<%@page import="com.g4g.dto.TwoplayertournamentDTO"%>
<%@page import="com.g4g.delegator.TwoPlayerTournamentServiceDelegator"%>
<%@page import="com.g4g.dto.SearchCriteria"%>
<%@page import="com.g4g.dto.TwoplayermatchDTO"%>
<%@page import="com.g4g.dto.GameDTO"%>
<%@page import="com.g4g.delegator.GameServiceDelegator"%>
<%@page import="com.g4g.utils.TournamentsUtil"%>
<%@page import="java.util.List"%>
<%@page import="com.g4g.dto.Twoplayermatchcomments"%>
<%@page import="com.g4g.delegator.MatchCommentsServiceDelegator"%>
<%@page import="com.g4g.dto.UserDTO"%>
<%@page import="com.g4g.utils.DateUtil"%>
<%@page import="com.g4g.utils.SessionUtil"%>
<%
	UserDTO userDTO = new UserDTO();
	if (DataUtil.getUserDTO(request) != null)
		userDTO = DataUtil.getUserDTO(request);

	PlayerDTO playerDTO = PlayerServiceDelegator.getPlayer(Integer
			.parseInt(DataUtil.decrypt(request
					.getParameter(G4GConstants.FROMID))));

	//MatchDTO matchDTO = TwoPlayerMatchServiceDelegator.getMatchInformation(messageDTO.getMatchid(), request);

	SearchCriteria searchCriteria = new SearchCriteria();
	searchCriteria.setAttribute(G4GConstants.ID, Integer
			.parseInt(request.getParameter(G4GConstants.MATCHID)));
	TwoplayermatchDTO twoplayermatchDTO = TwoPlayerMatchServiceDelegator
			.getList(searchCriteria).get(0);

	searchCriteria.removeAllAttribute();
	searchCriteria.setAttribute(G4GConstants.ID, twoplayermatchDTO
			.getTwoplayertournament().getId());
	TwoplayertournamentDTO twoplayertournamentDTO = TwoPlayerTournamentServiceDelegator
			.getList(searchCriteria).get(0);
	GameDTO gameDTO = GameServiceDelegator
			.getGame(twoplayertournamentDTO.getGameDTO().getId());
	searchCriteria.removeAllAttribute();
	searchCriteria.setAttribute(G4GConstants.MATCHID_DB, request
			.getParameter(G4GConstants.MATCHID));
	List<Twoplayermatchcomments> comments = MatchCommentsServiceDelegator
			.getList(searchCriteria);

	String date = DataUtil.getDate(DateUtil.getDateOfTimeZone(DataUtil
			.getDate(twoplayermatchDTO.getScheduledstartdate()
					.toString(),
					G4GConstants.DATE_YYYY_MM_DD_HH_MM_SS_sss), userDTO
			.getOffset()), G4GConstants.DATE_DD_MM_YYYY);
	String time = DataUtil.getDate(DateUtil.getDateOfTimeZone(DataUtil
			.getDate(twoplayermatchDTO.getScheduledstartdate()
					.toString(),
					G4GConstants.DATE_YYYY_MM_DD_HH_MM_SS_sss), userDTO
			.getOffset()), G4GConstants.DATE_H_MM_A);
%>

<div align="right">
	<br>
</div>
<div class="hideDiv"
	id="body<%=request.getParameter(G4GConstants.RANDOMID)%>">
	<div class="MessageContent clearfix">
		<div class="CloseButton">
			<a onclick="javascript:closeMessage(this)"
				id="close<%=request.getParameter(G4GConstants.RANDOMID)%>"
				href="javascript:{}">Close</a>
		</div>

		<div class="messageInfo grid grid9">
			<dl class="">
				<dt>
					<a><img
							src="WebContent/<%=SessionUtil.getSiteId(request)%>/css/images/icons/challenge.png">Match
						Confirmation</a>
				</dt>
				<dd>
					<p>
						Your upcoming game has been canceled (<%=playerDTO.getScreenname()%>)
						has canceled your upcoming match with the below details
					</p>
				</dd>
			</dl>
			<jsp:include page="../../../common/avatar.jsp">
					<jsp:param name="playerid" value="<%=playerDTO.getId() %>"/>
					<jsp:param name="avatarid" value="<%= (playerDTO.getAvatars() != null) ? playerDTO.getAvatars().getId() : 0 %>"/>
					<jsp:param name="screenname" value="<%=playerDTO.getScreenname() %>"/>
					<jsp:param name="isOnline" value="<%=playerDTO.isIsonline() %>"/>
					<jsp:param name="pictureId" value="<%=playerDTO.getPictureId() %>"/>
					<jsp:param name="showMenu" value="false"/>
					<jsp:param name="isLink" value="false"/>
		</jsp:include>

			<ul class="buttons">
				<li>
					<a href="<%=G4GConstants.GAME_DETAIL%><%=gameDTO.getId()%>"
						class="gray">Game Details</a>
				</li>
				<li>
					<a href="#" class="green">Close</a>
				</li>
			</ul>

			<table class="generalInfo">
				<tbody>


					<tr>
						<th scope="row">
							Entry Fee:&nbsp;&nbsp;
						</th>
						<td>
							$<%=twoplayertournamentDTO.getEntryfee()%></td>
					</tr>
					<tr>
						<th scope="row">
							Jackpot:&nbsp;&nbsp;
						</th>
						<td>
							$<%= twoplayertournamentDTO.getJackpot() %></td>
					</tr>
					<tr>
						<th scope="row">
							Date:&nbsp;&nbsp;
						</th>
						<td><%=date%></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
