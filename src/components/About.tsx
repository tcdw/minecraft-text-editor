import { useTranslation, Trans } from "react-i18next";

export default function About() {
    const { t } = useTranslation();

    return (
        <div
            className={
                "prose max-w-full prose-img:rounded-lg prose-thead:border-b-2 prose-th:text-base prose-th:leading-8 prose-td:text-base prose-td:leading-8 prose-li:my-0.5"
            }
        >
            <h2>{t("about.title")}</h2>
            <p>{t("about.description")}</p>
            <p>{t("about.uniqueFeature")}</p>
            <p>{t("about.requirements")}</p>
            <ul>
                <li>
                    <Trans
                        i18nKey="about.installEssentialsX"
                        components={{
                            1: <a href="https://essentialsx.net/" target="_blank" rel="noreferrer" />,
                        }}
                    />
                </li>
                <li>{t("about.openPermissions")}</li>
            </ul>
            <p>{t("about.rgbNote")}</p>
        </div>
    );
}
