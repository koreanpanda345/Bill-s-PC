---
description: How to use team commands.
---

# Team Commands

## How to add a team

Its pretty simple. Lets say I want to add the following

> Best Bunny
>
> Lopunny-Mega @ Lopunnite  
> Ability: Scrappy  
> EVs: 252 Atk / 4 SpD / 252 Spe  
> Jolly Nature
>
> * Fake Out  
> * Quick Attack  
> * Return  
> * High Jump Kick

All I need to do is the following:

> In discord:
>
> b!addteam Best Bunny, Lopunny-Mega @ Lopunnite  
> Ability: Scrappy  
> EVs: 252 Atk / 4 SpD / 252 Spe  
> Jolly Nature
>
> * Fake Out  
> * Quick Attack  
> * Return  
> * High Jump Kick, public

{% hint style="info" %}
 You do not need to include if you want it to be sent to you publicly or dms. But it will by default send it publicly, so keep this in mind if you have a team that you do not want to be seen to anyone that you should add the ,dm to the command.
{% endhint %}

Thats all I need to do.

## How do I find the team id?

simply type in `b!teams` and look for your team. the team id will be the first number in the line that your team is in.

## How do I view my team?

If you know what team id your team is under, then you have answer already. simply type this in:

> In Discord:
>
> b!getteam &lt;team id&gt;
>
> example
>
> b!getteam 1

And your team should be sent to the channel, or to your dms, depending on how you wanted it to be sent.

## How do I edit my team?

just like viewing your team, you need the team id. once you know what the team id is, then all you need to do is add the update team after the team id, with a , inbetween them, like so

> In Discord:
>
> b!editteam 1,  Lopunny-Mega @ Lopunnite  
> Ability: Scrappy  
> EVs: 252 Atk / 4 SpD / 252 Spe  
> Jolly Nature
>
> * Fake Out 
> * Quick Attack  
> * Return 
> * High Jump Kick, public

and your team will be updated.

## How do I delete my team?

using the team id of the team you want to delete, just do the following:

> In Discord:
>
> b!delteam &lt;team id&gt;
>
> example
>
> b!delteam 1

and your team should be deleted.

