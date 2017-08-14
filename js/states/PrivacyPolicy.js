class PrivacyPolicy extends DomContentState
{
    create()
    {
        super.create();
        this.showDomElement('privacyPolicy');
    }

    shutdown()
    {
        this.hideDomElement('privacyPolicy');
    }
}